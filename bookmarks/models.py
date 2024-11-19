from accounts.models import User
from django.db import models

class Collection(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="collections")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Bookmark(models.Model):
    title = models.CharField(max_length=200)
    url = models.URLField()
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookmarks")
    collection = models.ForeignKey(Collection, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookmarks")
    tags = models.ManyToManyField(Tag, blank=True, related_name="bookmarks")
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class BookmarkArchive(models.Model):
    bookmark = models.OneToOneField(Bookmark, on_delete=models.CASCADE, related_name="archive")
    content = models.TextField(blank=True, null=True)
    archived_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Archive of {self.bookmark.title}"
