from django import forms
from .models import TaglyUser
from django.contrib.auth.forms import UserCreationForm

class TaglyUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = TaglyUser
        fields = ['username', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data['email']
        if TaglyUser.objects.filter(email=email).exists():
            raise forms.ValidationError('A user with this email already exists.')
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user
