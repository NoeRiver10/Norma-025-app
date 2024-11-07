// src/app/hooks/useHandleChange.ts
import React from 'react';

export function useHandleChange<T>(setData: React.Dispatch<React.SetStateAction<T>>) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
}
