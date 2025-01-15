import React, { useState, useEffect } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { createClient } from '@supabase/supabase-js';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    function AdviceDisplay() {
      const [advice, setAdvice] = useState(null);
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(true);
      const { financialDataId } = useParams();
      const navigate = useNavigate();
      if (!supabaseUrl || !supabaseKey || supabaseUrl === "YOUR_SUPABASE_URL" || supabaseKey === "YOUR_SUPABASE_ANON_KEY") {
        return <div className="error-message">Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the .env file.</div>;
      }
      const supabase = createClient(supabaseUrl, supabaseKey);
      useEffect(() => {
        const fetchAdvice = async () => {
          setLoading(true);
          const { data, error } = await supabase
            .from("financial_advice")
            .select("*")
            .eq('financial_data_id', financialDataId)
            .order("created_at", { ascending: false })
            .limit(1);
          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
          if (data && data.length > 0) {
            setAdvice(data[0]);
          } else {
            setAdvice(null);
          }
          setLoading(false);
        };
        fetchAdvice();
      }, [financialDataId]);
      const handleGoBack = () => {
        navigate('/input');
      };
      if (loading) {
        return <div className="loading-container"><div className="loading-spinner"></div></div>;
      }
      if (error) {
        return <div className="error-message">Error: {error}</div>;
      }
      if (!advice) {
        return <div>No advice available yet.</div>;
      }
      return (
        <div className="advice-container">
          <button onClick={handleGoBack}>Back</button>
          <h2>Financial Advice</h2>
          <p><strong>Financial Health Score:</strong> {advice.financial_health_score}</p>
          <p><strong>Budget Recommendation:</strong> {JSON.stringify(advice.budget_recommendation)}</p>
          <p><strong>Financial Goal Analysis:</strong> {advice.financial_goal_analysis}</p>
          <p><strong>Investment Advice:</strong> {advice.investment_advice}</p>
        </div>
      );
    }
    export default AdviceDisplay;