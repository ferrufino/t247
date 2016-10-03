from flask_restplus import fields
from api.restplus import api

user_auth = api.model('UserAuth', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

user_token = api.model('UserToken', {
    'token': fields.String(required=True, description='User auth token')
})

user = api.model('User', {
    'email': fields.String(required=True, description='User email'),
    'first_name': fields.String(required=True, description='User name'),
    'last_name': fields.String(required=True, description='User last name'),
    'role': fields.String(required=True, description='User role')
    'enrollment': fields.String(required=True, description='User enrollment number')
})


# blog_post = api.model('Blog post', {
#     'id': fields.Integer(readOnly=True, description='The unique identifier of a blog post'),
#     'title': fields.String(required=True, description='Article title'),
#     'body': fields.String(required=True, description='Article content'),
#     'pub_date': fields.DateTime,
#     'category_id': fields.Integer(attribute='category.id'),
#     'category': fields.String(attribute='category.id'),
# })

# pagination = api.model('A page of results', {
#     'page': fields.Integer(description='Number of this page of results'),
#     'pages': fields.Integer(description='Total number of pages of results'),
#     'per_page': fields.Integer(description='Number of items per page of results'),
#     'total': fields.Integer(description='Total number of results'),
# })

# page_of_blog_posts = api.inherit('Page of blog posts', pagination, {
#     'items': fields.List(fields.Nested(blog_post))
# })

# category = api.model('Blog category', {
#     'id': fields.Integer(readOnly=True, description='The unique identifier of a blog category'),
#     'name': fields.String(required=True, description='Category name'),
# })

# category_with_posts = api.inherit('Blog category with posts', category, {
#     'posts': fields.List(fields.Nested(blog_post))
# })
