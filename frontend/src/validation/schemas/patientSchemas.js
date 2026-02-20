import * as yup from 'yup'

export const patientSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  dob: yup
    .string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
  medicalNotes: yup
    .string()
    .required('Medical notes are required')
    .min(5, 'Medical notes must be at least 5 characters')
    .max(1000, 'Medical notes must be less than 1000 characters')
})
