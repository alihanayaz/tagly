from django.urls import path
from . import views

app_name = "bookmarks"
urlpatterns = [
    path("", views.index, name="index"),
    path('bookmarks/', views.get_bookmarks, name='get_bookmarks'),
    path('bookmarks/create-bookmark/', views.create_bookmark, name='create_bookmark'),
    path('collections/create-collection/', views.create_collection, name='create_collection'),
    path('bookmarks/<int:pk>/edit/', views.edit_bookmark, name='edit_bookmark'),
    path('collections/<int:pk>/edit/', views.edit_collection, name='edit_collection'),
    path('collections/', views.get_collections, name='get_collections'),
    path('bookmarks/<int:pk>/delete/', views.delete_bookmark, name='delete_bookmark'),
    path('collections/<int:pk>/delete/', views.delete_collection, name='delete_collection'),
    path('bookmarks/<int:pk>/toggle-favorite/', views.toggle_favorite, name='toggle_favorite'),
]
