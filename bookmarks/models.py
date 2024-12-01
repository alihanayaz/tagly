from accounts.models import TaglyUser
from django.db import models

class Collection(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(TaglyUser, on_delete=models.CASCADE, related_name="collections")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Bookmark(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField()
    user = models.ForeignKey(TaglyUser, on_delete=models.CASCADE, related_name="bookmarks")
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookmarks")
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
