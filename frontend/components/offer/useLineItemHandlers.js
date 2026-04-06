import { useFormikContext } from "formik";
import axios from "@/utils/axios";

export function useLineItemHandlers(items, makes = []) {
  const { values, setFieldValue } = useFormikContext();

  const handleMakeSelect = (index, makeId) => {
    const make = makes.find((m) => m.value === makeId);
    setFieldValue(`lineItems.${index}.selectedMakeId`, makeId);
    setFieldValue(`lineItems.${index}.makeName`, make?.label || "");
    setFieldValue(`lineItems.${index}.productValue`, "");
    setFieldValue(`lineItems.${index}.title`, "");
    setFieldValue(`lineItems.${index}.options`, []);
    setFieldValue(`lineItems.${index}.selectedOptions`, []);
    setFieldValue(`lineItems.${index}.selectedVariantId`, "");
    setFieldValue(`lineItems.${index}.priceList`, "");
    setFieldValue(`lineItems.${index}.priceOffer`, "");
    setFieldValue(`lineItems.${index}.priceNet`, "");
  };

  const handleProductSelect = (index, value) => {
    const master = items.find((o) => o.value === value);
    if (!master) return;
    setFieldValue(`lineItems.${index}`, {
      ...values.lineItems[index],
      productValue: master.value,
      title: master.label,
      caption: master.title || "",
      productDesc: master.desc || "",
      image: master.image || "",
      currency: master.currency,

      options: [],
      selectedOptions: [],
      selectedVariantId: "",
      variantDesc: "",
      variantPriceList: 0,
      variantPriceOffer: 0,
      variantPriceNet: 0,
      priceList: "",
      priceOffer: "",
      priceNet: "",
      notes: "",
      condition: master.condition,
      quantity: 1,
    });
  };

  const handleVariantSelect = async (index, variantId) => {
    const lineItem = values.lineItems[index];
    const master = items.find((o) => o.value === lineItem.productValue);
    const variant = master?.variants?.find((v) => String(v._id) === variantId);
    const { data } = await axios.get(`/api/option/list/${lineItem.productValue}`);
    const optionList = data.list || [];

    setFieldValue(`lineItems.${index}.selectedVariantId`, variantId);
    setFieldValue(`lineItems.${index}.options`, optionList);
    setFieldValue(`lineItems.${index}.selectedOptions`, []);

    if (variant) {
      const makeName = lineItem.makeName || "";
      const masterLabel = master?.label || "";
      const variantModel = variant.modelType || "";
      const autoTitle = [makeName, masterLabel, variantModel].filter(Boolean).join(" ");

      setFieldValue(`lineItems.${index}.title`, autoTitle);
      setFieldValue(`lineItems.${index}.variantPriceList`, variant.priceList || 0);
      setFieldValue(`lineItems.${index}.variantPriceOffer`, variant.priceOffer || 0);
      setFieldValue(`lineItems.${index}.variantPriceNet`, variant.priceNet || 0);
      setFieldValue(`lineItems.${index}.priceList`, variant.priceList || 0);
      setFieldValue(`lineItems.${index}.priceOffer`, variant.priceOffer || 0);
      setFieldValue(`lineItems.${index}.priceNet`, variant.priceNet || 0);
      setFieldValue(`lineItems.${index}.variantCode`, variant.code || "");
      setFieldValue(`lineItems.${index}.variantModel`, variantModel);
      setFieldValue(`lineItems.${index}.variantDesc`, variant.desc || "");
    }
  };

  return { handleMakeSelect, handleProductSelect, handleVariantSelect };
}
