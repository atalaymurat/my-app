const Transport = require("winston-transport");
const mongoose = require("mongoose");

class MongoTransport extends Transport {
  constructor(opts = {}) {
    super(opts);
    this._batch = [];
    this._timer = null;
    this._pending = [];
  }

  _isReady() {
    return mongoose.connection.readyState === 1;
  }

  log(info, callback) {
    const isDev = !["production", "prod"].includes(process.env.NODE_ENV);
    if (isDev) {
      callback();
      return;
    }
    setImmediate(() => this.emit("logged", info));
    const {
      level,
      message,
      service,
      env,
      [Symbol.for("level")]: rawLevel,
      [Symbol.for("message")]: _m,
      [Symbol.for("splat")]: _s,
      ...meta
    } = info;
    // colorize() ANSI ekleyebilir, karşılaştırma için Symbol'den oku
    const cleanLevel = rawLevel || level;
    const entry = {
      level: cleanLevel,
      message,
      meta: Object.keys(meta).length ? meta : undefined,
      service: service || "backend",
      timestamp: new Date(),
    };
    if (cleanLevel === "error" || cleanLevel === "warn") {
      this._writeNow([entry]);
    } else {
      this._batch.push(entry);
      if (this._batch.length >= 10) {
        this._flush();
      } else if (!this._timer) {
        this._timer = setTimeout(() => this._flush(), 5000);
      }
    }
    callback();
  }

  _writeNow(entries) {
    if (!this._isReady()) {
      this._pending.push(...entries);
      mongoose.connection.once("connected", () => {
        const toWrite = this._pending.splice(0);
        if (toWrite.length) this._actualWrite(toWrite);
      });
      return;
    }
    this._actualWrite(entries);
  }

  _actualWrite(entries) {
    setImmediate(async () => {
      try {
        const Log = require("../models/Log");
        const result = await Log.insertMany(entries, { ordered: false });

        try {
          const { getIO } = require("./socket");
          const io = getIO();
          const roomSize = io.sockets.adapter.rooms.get("logs")?.size || 0;
          if (roomSize > 0) {
            const savedLogs = result.map((doc) => doc.toObject());
            io.to("logs").emit("new-log", savedLogs);
          }
        } catch (_) {}
      } catch (err) {
        console.error("[MongoTransport]", err.message);
      }
    });
  }

  _flush() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    const toFlush = this._batch.splice(0);
    if (toFlush.length > 0) this._writeNow(toFlush);
  }
}

module.exports = MongoTransport;
