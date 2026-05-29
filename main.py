from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/post_api")
async def post_api(request_data: dict):
    print(request_data)
    return {"message": "Data received successfully"}
# around 5 to 6 apis will create for the study planner, 
# such as creating a study plan, getting the study plan, 
# updating the study plan, deleting the study plan, etc.