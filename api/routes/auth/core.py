import hashlib


def _user(id, name, avatar):
    return {
        'id': hashlib.sha256(str(id).encode('utf-8')).hexdigest(),
        'name': name,
        'avatar': avatar
    }


def user_from_oauth(website, profile):
    if website == 'github':
        return _user(id=profile['node_id'],
                     name=profile.get('name'),
                     avatar=profile.get('avatar_url'))

    elif website == 'google':
        return _user(id=profile['sub'],
                     name=profile.get('name'),
                     avatar=profile.get('picture'))

    elif website == 'stackoverflow':
        return _user(id=profile['items'][0]['user_id'],
                     name=profile['items'][0]['display_name'],
                     avatar=profile['items'][0]['profile_image'])

    else:
        return {}
