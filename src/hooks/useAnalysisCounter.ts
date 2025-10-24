"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useAnalysisCounter() {
  const { data: session } = useSession();
  const [analysisCount, setAnalysisCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalysisCount();
    } else {
      // Pour les utilisateurs non connectés, utiliser le localStorage
      const localCount = localStorage.getItem('dvia_analysis_count');
      setAnalysisCount(localCount ? parseInt(localCount) : 0);
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const fetchAnalysisCount = async () => {
    try {
      const response = await fetch(`/api/user/analysis-count?userId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisCount(data.count);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du compteur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementAnalysisCount = async () => {
    if (session?.user?.id) {
      // Utilisateur connecté : utiliser l'API
      try {
        const response = await fetch("/api/user/increment-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalysisCount(data.count);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur lors de l'incrémentation du compteur:", error);
        return false;
      }
    } else {
      // Utilisateur non connecté : utiliser le localStorage
      const newCount = analysisCount + 1;
      localStorage.setItem('dvia_analysis_count', newCount.toString());
      setAnalysisCount(newCount);
      return true;
    }
  };

  const canAnalyze = analysisCount < 1; // Première analyse gratuite
  const remainingFree = Math.max(0, 1 - analysisCount);

  return {
    analysisCount,
    isLoading,
    canAnalyze,
    remainingFree,
    incrementAnalysisCount,
    refetch: fetchAnalysisCount,
  };
}
