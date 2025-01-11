from django import forms
from django.contrib.auth import get_user_model

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    #the widget used to include 'type=password' on HTML

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label="Password",
                               widget=forms.PasswordInput)
    password2 = forms.CharField(label="Repeat Password",
                                widget=forms.PasswordInput)
    class Meta:
        model = get_user_model()
        """
            get_user_model() used to retrieve the user model dynamically,
            and it is better to keep the code generic than using AUTH_USER_MODEL
            the fields validation will be according to the model
        """
        fields = ['email', 'username', 'first_name']
    
    def clean_password2(self):
        cd = self.cleaned_data
        if (cd['password'] != cd['password2']):
            raise forms.ValidationError("Passwords do not match.")
        return (cd['password2'])
    """
        this method will be executed when is_valid() is called
        note the name -> ```clean_<field_name>```
    """

class UserEditForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ['first_name', 'last_name', 'avatar']
