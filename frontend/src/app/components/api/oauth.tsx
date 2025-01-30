import Cookie from 'js-cookie';
import axios from 'axios';

const handleOAuth = async (
    code: string | null,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, url:string
) => {
    if (code) {
      
  
      try {
        console.log("response");
		const response = await axios.get(url, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
        if (response.status === 200) {
			const result = response.data;
			Cookie.set('access', result.access_token);
			Cookie.set('refresh', result.refresh_token);
			setLoading(false)
        } else {
          	setErrorMessage(response.data.message || 'Authentication failed. Please try again.');
        	}
      	} catch (error) {
        	setErrorMessage('An error occurred. Please check your internet connection and try again.');
      	} finally {
        	setLoading(false);
    	}
	}
};

export {handleOAuth };