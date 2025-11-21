"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useSignupStore } from "@/stores/signupStore";

export type SignupFormData = {
  // Step1
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  code?: string;
  // Step2
  address?: string;
  coordinates?: [number, number];
  // Step3
  companyName?: string;
  legalName?: string;
  siret?: string;
  legalStatus?: string;
  // Step3
  workPhotos?: Array<{ base64: string; name: string; type: string }>;
  // Step4
  services?: string;
  experienceYears?: string;
  specialties?: string;
  description?: string;
  photos?: Array<{ base64: string; name: string; type: string }>;
  // Métadonnées
  completedSteps?: number[];
  currentStep?: number;
  stepParts?: Record<number, number>;
  timestamp?: string;
  isSave?: boolean;
  [key: string]: any;
};

const STORAGE_KEY = "signupFormData";

export function useSignupForm() {
  // Charger les données depuis localStorage
  const loadFormData = useCallback((): SignupFormData => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    }
    return {};
  }, []);

  // Sauvegarder les données dans localStorage
  const saveFormData = useCallback((data: Partial<SignupFormData>, silent: boolean = false) => {
    try {
      const existing = loadFormData();
      const updated = {
        ...existing,
        ...data,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (!silent) {
        toast.success("Données sauvegardées avec succès");
      }
      return true;
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      if (!silent) {
        toast.error("Erreur lors de la sauvegarde");
      }
      return false;
    }
  }, [loadFormData]);

  // Obtenir une valeur spécifique
  const getFormValue = useCallback((key: string): any => {
    const data = loadFormData();
    return data[key];
  }, [loadFormData]);

  // Mettre à jour une valeur spécifique
  const updateFormValue = useCallback((key: string, value: any, silent: boolean = false) => {
    saveFormData({ [key]: value }, silent);
  }, [saveFormData]);

  // Effacer toutes les données
  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Collecter toutes les données actuelles depuis le store
  const collectCurrentFormData = useCallback((): SignupFormData => {
    const data: SignupFormData = loadFormData();
    
    // Récupérer toutes les données depuis le store
    const store = useSignupStore.getState();
    
    // Step1
    if (store.firstName) data.firstName = store.firstName;
    if (store.lastName) data.lastName = store.lastName;
    if (store.email) data.email = store.email;
    if (store.password) data.password = store.password;
    if (store.phoneNumber) data.phoneNumber = store.phoneNumber;
    if (store.code) data.code = store.code;
    
    // Step2 (adresse depuis le store ou sessionStorage)
    if (store.address) {
      data.address = store.address;
    } else if (typeof window !== "undefined") {
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (storedAddress) {
        data.address = storedAddress;
      }
    }
    
    // Coordonnées depuis le store ou sessionStorage
    if (store.coordinates) {
      data.coordinates = store.coordinates;
    } else if (typeof window !== "undefined") {
      const storedCoords = sessionStorage.getItem("selectedCoordinates");
      if (storedCoords) {
        try {
          data.coordinates = JSON.parse(storedCoords);
        } catch (e) {
          console.error("Erreur lors du parsing des coordonnées:", e);
        }
      }
    }
    
    // Step2/Step3 (informations entreprise)
    if (store.companyName) data.companyName = store.companyName;
    if (store.legalName) data.legalName = store.legalName;
    if (store.siret) data.siret = store.siret;
    if (store.legalStatus) data.legalStatus = store.legalStatus;
    
    // Step4
    if (store.services) data.services = store.services;
    if (store.experienceYears) data.experienceYears = store.experienceYears;
    if (store.specialties) data.specialties = store.specialties;
    if (store.description) data.description = store.description;
    
    return data;
  }, [loadFormData]);

  return {
    loadFormData,
    saveFormData,
    getFormValue,
    updateFormValue,
    clearFormData,
    collectCurrentFormData,
  };
}

