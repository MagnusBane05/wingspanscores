## Prerequisites: 
- git
- docker ([docker install](https://docs.docker.com/desktop/setup/install/windows-install/))

## Steps to run the application:
1. Clone the project into a directory by using the command: `git clone https://github.com/MagnusBane05/wingspanscores.git`
2. Navigate to the project directory: `cd wingspanscores`
3. Make sure Docker Desktop is running on your machine
4. Run the project with the command: `docker-compose up`
5. Navigate to `http://localhost:3000/` in your browser

## Running development version:
### API
1. Navigate to api directory: `cd api`
2. If no venv folder, create venv: `python -m venv venv`
3. Activate virtual environment: `source ./venv/Scripts/activate` (the command `where python` should show ...\venv\Scripts\python)
4. Install dependencies: `pip install -r requirements.txt`
5. Navigate to project root `cd ..`
6. Start API: `npm run start-api`

### Frontend
1. Start the frontend: `npm run dev`
2. Open `http://localhost:3000/` in your browser