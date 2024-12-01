import json
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .models import Bookmark, Collection

ITEMS_PER_PAGE = 10

def paginate_queryset(queryset, page, items_per_page=ITEMS_PER_PAGE):
    """
    Helper function to paginate a queryset.
    """
    paginator = Paginator(queryset, items_per_page)
    try:
        paginated_items = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        return None, paginator.num_pages
    return paginated_items, paginator.num_pages

def index(request):
    """
    Render the main bookmarks page with the user's collections if authenticated.
    If the user is not authenticated, redirect to a welcome page.
    """
    if request.user.is_authenticated:
        collections = Collection.objects.filter(user=request.user)
        return render(request, "bookmarks/index.html", {"collections": collections})
    else:
        return render(request, "bookmarks/welcome.html")

@login_required
@require_http_methods(["GET"])
def get_bookmarks(request):
    """
    Fetch bookmarks with optional filters for collections and favorites.
    """
    collection_id = request.GET.get("collection_id")
    is_favorite = request.GET.get("is_favorite") == "true"
    page = request.GET.get("page", 1)

    bookmarks = Bookmark.objects.filter(user=request.user).order_by('-created_at')
    if collection_id:
        bookmarks = bookmarks.filter(collection_id=collection_id)
    if is_favorite:
        bookmarks = bookmarks.filter(is_favorite=True)

    paginated_bookmarks, total_pages = paginate_queryset(bookmarks, page)
    if not paginated_bookmarks:
        return JsonResponse({"error": "Invalid page number"}, status=400)

    return JsonResponse({
        "bookmarks": list(paginated_bookmarks.object_list.values(
            "id", "title", "url", "is_favorite", "collection__name", "collection__id"
        )),
        "has_next": paginated_bookmarks.has_next(),
        "has_previous": paginated_bookmarks.has_previous(),
        "current_page": paginated_bookmarks.number,
        "total_pages": total_pages,
    })

@login_required
@require_http_methods(["GET"])
def get_collections(request):
    """
    Fetch all collections for the logged-in user.
    """
    collections = Collection.objects.filter(user=request.user).values("id", "name")
    return JsonResponse({"collections": list(collections)})

@login_required
@require_http_methods(["POST"])
def create_collection(request):
    """
    Create a new collection for the user.
    """
    data = json.loads(request.body)
    name = data.get("name")
    if not name:
        return JsonResponse({"error": "Collection name is required"}, status=400)
    Collection.objects.create(name=name, user=request.user)
    return JsonResponse({"success": True, "message": "Collection created successfully"})

@login_required
@require_http_methods(["POST"])
def create_bookmark(request):
    """
    Create a new bookmark for the user.
    """
    data = json.loads(request.body)
    title = data.get("title")
    url = data.get("url")
    if not title or not url:
        return JsonResponse({"error": "Title and URL are required"}, status=400)
    Bookmark.objects.create(user=request.user, title=title, url=url)
    return JsonResponse({"success": True, "message": "Bookmark created successfully"})

@login_required
@require_http_methods(["POST"])
def edit_bookmark(request, pk):
    """
    Edit an existing bookmark.
    """
    bookmark = get_object_or_404(Bookmark, pk=pk, user=request.user)
    data = json.loads(request.body)
    title = data.get("title")
    url = data.get("url")
    collection_id = data.get("collection")

    if title:
        bookmark.title = title
    if url:
        bookmark.url = url
    if collection_id:
        collection = get_object_or_404(Collection, pk=collection_id, user=request.user)
        bookmark.collection = collection

    bookmark.save()
    return JsonResponse({"success": True, "message": "Bookmark updated successfully"})

@login_required
@require_http_methods(["POST"])
def edit_collection(request, pk):
    """
    Edit an existing collection.
    """
    collection = get_object_or_404(Collection, pk=pk, user=request.user)
    data = json.loads(request.body)
    name = data.get("name")
    if not name:
        return JsonResponse({"error": "Collection name is required"}, status=400)
    collection.name = name
    collection.save()
    return JsonResponse({"success": True, "message": "Collection updated successfully"})

@login_required
@require_http_methods(["POST"])
def toggle_favorite(request, pk):
    """
    Toggle the favorite status of a bookmark.
    """
    bookmark = get_object_or_404(Bookmark, pk=pk, user=request.user)
    bookmark.is_favorite = not bookmark.is_favorite
    bookmark.save()
    return JsonResponse({"success": True, "is_favorite": bookmark.is_favorite})

@login_required
@require_http_methods(["POST"])
def delete_bookmark(request, pk):
    """
    Delete a bookmark.
    """
    bookmark = get_object_or_404(Bookmark, pk=pk, user=request.user)
    bookmark.delete()
    return JsonResponse({"success": True, "message": "Bookmark deleted successfully"})

@login_required
@require_http_methods(["POST"])
def delete_collection(request, pk):
    """
    Delete a collection.
    """
    collection = get_object_or_404(Collection, pk=pk, user=request.user)
    collection.delete()
    return JsonResponse({"success": True, "message": "Collection deleted successfully"})
