import json
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from .models import Collection, Bookmark
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required

ITEMS_PER_PAGE = 10

def paginate_queryset(queryset, page, items_per_page=ITEMS_PER_PAGE):
    paginator = Paginator(queryset, items_per_page)
    try:
        paginated_items = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        return None, paginator.num_pages
    return paginated_items, paginator.num_pages

@login_required
def index(request):
    collections = Collection.objects.filter(user=request.user)
    return render(request, "bookmarks/index.html", {"collections": collections})

def index(request):
    if request.user.is_authenticated:
        collections = Collection.objects.filter(user=request.user)
    else:
        collections = []
    return render(request, "bookmarks/index.html", {"collections": collections})

@login_required
@require_GET
def get_all_bookmarks(request):
    page = request.GET.get('page', 1)
    bookmarks = Bookmark.objects.filter(user=request.user).order_by('-created_at')

    paginated_bookmarks, total_pages = paginate_queryset(bookmarks, page)
    if not paginated_bookmarks:
        return JsonResponse({"error": "Invalid page number"}, status=400)

    data = {
        "bookmarks": list(paginated_bookmarks.object_list.values("id", "title", "url", "is_favorite", "collection__name")),
        "has_next": paginated_bookmarks.has_next(),
        "has_previous": paginated_bookmarks.has_previous(),
        "current_page": paginated_bookmarks.number,
        "total_pages": total_pages,
    }
    return JsonResponse(data)

@login_required
@require_GET
def get_bookmarks_by_collection(request, collection_id):
    page = request.GET.get('page', 1)
    collection = get_object_or_404(Collection, id=collection_id, user=request.user)
    bookmarks = collection.bookmarks.values("id", "title", "url", "is_favorite")

    paginated_bookmarks, total_pages = paginate_queryset(bookmarks, page)
    if not paginated_bookmarks:
        return JsonResponse({"error": "Invalid page number"}, status=400)

    data = {
        "bookmarks": list(bookmarks),
        "collection": collection.name,
        "has_next": paginated_bookmarks.has_next(),
        "has_previous": paginated_bookmarks.has_previous(),
        "current_page": paginated_bookmarks.number,
        "total_pages": total_pages,
    }
    return JsonResponse(data)

@login_required
@require_GET
def get_favorite_bookmarks(request):
    page = request.GET.get('page', 1)
    bookmarks = Bookmark.objects.filter(user=request.user, is_favorite=True)

    paginated_bookmarks, total_pages = paginate_queryset(bookmarks, page)
    if not paginated_bookmarks:
        return JsonResponse({"error": "Invalid page number"}, status=400)

    data = {
        "bookmarks": list(paginated_bookmarks.object_list.values("id", "title", "url", "is_favorite", "collection__name")),
        "has_next": paginated_bookmarks.has_next(),
        "has_previous": paginated_bookmarks.has_previous(),
        "current_page": paginated_bookmarks.number,
        "total_pages": total_pages,
    }

    return JsonResponse(data)

@login_required
@require_POST
def create_collection(request):
    user = request.user
    data = json.loads(request.body)
    name = data.get("name")
    Collection.objects.create(name=name, user=user)
    return JsonResponse({"success": True, "message": "Collection created successfully"})

@login_required
@require_POST
def create_bookmark(request):
    user = request.user
    data = json.loads(request.body)
    title = data.get("title")
    url = data.get("url")
    Bookmark.objects.create(user=user, title=title, url=url)
    return JsonResponse({"success": True, "message": "Bookmark created successfully"})

@login_required
@require_POST
def edit_bookmark(request, pk):
    bookmark = get_object_or_404(Bookmark, pk=pk)
    data = json.loads(request.body)
    bookmark.title = data.get("title", bookmark.title)
    bookmark.url = data.get("url", bookmark.url)
    collection_id = data.get("collection")
    if collection_id:
        collection = get_object_or_404(Collection, id=collection_id, user=request.user)
        bookmark.collection = collection
    else:
        bookmark.collection = None
    bookmark.save()
    return JsonResponse({"success": True, "message": "Bookmark updated successfully"})

@login_required
@require_GET
def get_collections(request):
    collections = Collection.objects.filter(user=request.user).values("id", "name")
    return JsonResponse({"collections": list(collections)})

@login_required
@require_POST
def toggle_favorite(request, pk):
    bookmark = Bookmark.objects.get(id=pk, user=request.user)
    bookmark.is_favorite = not bookmark.is_favorite
    bookmark.save()
    return JsonResponse({"success": True, "is_favorite": bookmark.is_favorite})

@login_required
@require_POST
def delete_bookmark(request, pk):
    bookmark = get_object_or_404(Bookmark, pk=pk, user=request.user)
    bookmark.delete()
    return JsonResponse({"success": True, "message": "Bookmark deleted successfully"})

@login_required
@require_POST
def delete_collection(request, pk):
    collection = get_object_or_404(Collection, pk=pk, user=request.user)
    collection.delete()
    return JsonResponse({"success": True, "message": "Collection deleted successfully"})
