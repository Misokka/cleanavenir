'use client';
import React, { FormEvent, useEffect, useState } from 'react'
import { FormFieldWithInput } from '../atoms/FormField'
import { useTranslations } from 'next-intl'
import { Button } from '../atoms/Button'
import { savingProductErrosType, savingProductType, useCreateSavingProduct } from '@/features/admin/useCreateSavingProduct'
import { Typography } from '../atoms/Typography';
import { useGetSavingProducts } from '@/features/savings/useGetSavingProducts';
import { SavingProductDTO } from '@/infrastructure/web/services/savingService';

interface SavingProductFormProps {
  action: "create" | "edit",
  productToEdit?: savingProductType,
  isActive: boolean,
  onClose: () => void
  onSuccess: () => Promise<SavingProductDTO[] | undefined>;
}

function SavingProductForm({ action, productToEdit, isActive, onClose, onSuccess } :SavingProductFormProps) {
  const t = useTranslations('Director.savings.form');
  const {createSavingProduct, updateSavingProduct, isLoading, error, setError} = useCreateSavingProduct();
  const [formData, setFormData] = useState<savingProductType>({
    id: "",
    label: "",
    rate: 0
  });

  useEffect(() => {
    if (isActive && action === 'edit' && productToEdit) {
      setFormData(productToEdit);
    } else if (isActive && action === 'create') {
      // Optionnel : Reset du formulaire quand on ouvre en mode création
      setFormData({ id: "", label: "", rate: 0 });
    }
  }, [productToEdit, isActive, action]);

  const [errors, setErrors] = useState<Partial<savingProductErrosType>>({});
  
  const validateForm = (): boolean => {
    const newErrors: Partial<savingProductErrosType> = {};
    
    if (!formData.label) {
      newErrors.label = t('errors.labelRequired');
    } else if (formData.label.length < 2) {
      newErrors.label = t('errors.labelInvalid');
    }
    
    if (!formData.rate) {
      newErrors.rate = t('errors.rateRequired');
    } else if (formData.rate <= 0){
      newErrors.rate = t('errors.rateInvalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof savingProductType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  async function handleSubmit(e: FormEvent){
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const result = action == "create" ? await createSavingProduct(formData) : await updateSavingProduct(formData);
    if(result){
      reset();
      close();
      await onSuccess(); // <-- ici
      // prévoir une fonction pour rafraîchir la liste des produits d'épargne
    }

  }

  function reset(){
    setFormData({
      id: "",
      label: "",
      rate: 0
    });
    productToEdit = undefined;
  }

  function close(){
    reset();
    setErrors({});
    setError(null)
    onClose();
  }

  function triggerCloseForm(e: FormEvent){
    e.preventDefault();
    close();
  }

  return (
    <div className={`fixed w-screen h-screen top-0 left-0 z-50 ${isActive ? "block" : "hidden"} flex items-center justify-center`}>
      <div className='dark-layer w-full h-full absolute z-20 bg-black/45'></div>

      <form 
        className='bg-white relative z-[60] space-y-6 min-w-96 p-4 rounded-md'
        >
        <Typography variant='h3'>{action === 'create' ? t('titleCreate') : t('titleEdit')}</Typography>
        <FormFieldWithInput
          label={t('label')}
          type="label"
          value={formData.label}
          onChange={handleInputChange('label')}
          error={errors.label}
          required
          placeholder={t('labelPlaceholder')}
        />

        <FormFieldWithInput
          label={t('rate')}
          type="number"
          value={formData.rate}
          onChange={handleInputChange('rate')}
          error={errors.rate}
          required
          placeholder={t('ratePlaceholder')}
        />

        <div className='actions flex justify-between'>
          <Button variant='outline' onClick={triggerCloseForm}>
            {t('cancel')}
          </Button>

          <Button variant='primary' onClick={handleSubmit}>
            {t('confirm')}
          </Button>
        </div>

        {error && <>
          <div className="border border-red-300 bg-red-100 rounded-md p-2">
            <p className='text-red-500'>{error.message}</p>
          </div>
        </>}
      </form>
    </div>
  )
}

export default SavingProductForm