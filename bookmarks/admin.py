from django.contrib import admin
from .models import Collection, Bookmark

for model in [Collection, Bookmark]:
    admin.site.register(model)
