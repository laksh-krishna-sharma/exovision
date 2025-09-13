from pydantic import BaseModel
# Add this model for the request body
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str