from app.utils.security import hash_password, verify_password


def test_hash_password():
    # Test that the hashed password is not the same as the plain password
    plain_password = "securepassword123"
    hashed_password = hash_password(plain_password)
    assert hashed_password != plain_password
    assert isinstance(hashed_password, bytes)


def test_verify_password_correct():
    # Test verifying the correct password
    plain_password = "mypassword"
    hashed_password = hash_password(plain_password)
    assert verify_password(plain_password, hashed_password) is True


def test_verify_password_incorrect():
    # Test verifying an incorrect password
    plain_password = "mypassword"
    hashed_password = hash_password(plain_password)
    incorrect_password = "wrongpassword"
    assert verify_password(incorrect_password, hashed_password) is False
