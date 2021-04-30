from flask import Blueprint


update_profile = Blueprint('update_profile', __name__)


@update_profile.route('/<user_id>/update', methods=['POST'])
def update_user_profile(user_id):
    return {}, 200
