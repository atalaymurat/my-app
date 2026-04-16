"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import ProgressBar from "./wizard/ProgressBar";
import StepCompany from "./wizard/StepCompany";
import StepProducts from "./wizard/StepProducts";
import StepConditions from "./wizard/StepConditions";
import StepSummary from "./wizard/StepSummary";
import { validationSchema } from "./formConfig";

export default function OfferFormWizard({
  initialValues,
  loading,
  onSubmit,
  successMessage,
}) {
  const [message, setMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  if (loading) {
    return (
      <div className="text-stone-400 py-12 text-center text-sm">
        Yükleniyor...
      </div>
    );
  }

  const validateStep1 = async (validateForm, setTouched, values) => {
    if (values.companyId) return true;
    await setTouched({ title: true, city: true, country: true }, false);
    const errors = await validateForm();
    return !errors.title && !errors.city && !errors.country;
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        setMessage(null);
        try {
          const { __initialSnapshotCache, ...submitValues } = values;
          const data = await onSubmit(submitValues);
          if (data?.success) {
            setMessage({
              text: data.message || successMessage || "Başarıyla kaydedildi.",
              type: "success",
            });
          }
        } catch (err) {
          setMessage({
            type: "error",
            text: err.response?.data?.message || "Hata oluştu",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting, validateForm, setTouched }) => (
        <Form className="w-full">
          <ProgressBar currentStep={currentStep} />

          {currentStep === 0 && (
            <StepCompany
              values={values}
              validateStep1={validateStep1}
              validateForm={validateForm}
              setTouched={setTouched}
              onNext={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 1 && (
            <StepProducts onPrev={() => setCurrentStep(0)} onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <StepConditions onPrev={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />
          )}
          {currentStep === 3 && (
            <StepSummary onPrev={() => setCurrentStep(2)} message={message} isSubmitting={isSubmitting} />
          )}
        </Form>
      )}
    </Formik>
  );
}
