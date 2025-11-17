import { useEffect } from 'react';
import { useAuth } from '@/layouts/Root';

const Callback = () => {
  const { isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && window.ApperSDK) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSSOVerify("#authentication-callback");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div id="authentication-callback" className="w-full max-w-md"></div>
    </div>
  )
}

export default Callback;