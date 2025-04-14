const express = require("express");
const app = express();
app.use(express.json());  // Aggiungi questa riga per parsare il body delle richieste
const cors = require("cors");
const admin = require("firebase-admin");


// Inizializzazione di Firebase Admin
const serviceAccount = require("./config/codechallenge-drivedrop-firebase-adminsdk-fbsvc-5846502277.json"); // Sostituisci con il percorso del file .json delle credenziali

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Collega Firestore

const corsOptions = {
  origin: ["http://localhost:4200"],
};

app.use(cors(corsOptions));

// Endpoint per ottenere i progetti 
app.get('/api/projects', async (req, res) => {
  try {
    const snapshot = await db.collection("projects").get();
    
    // Aggiungi l'id al progetto
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,  // Qui è dove ottieni l'ID del documento
      ...doc.data(), // Aggiungi i dati del progetto
    }));

    res.json({ projects });
    // console.log(res);
    
  } catch (error) {
    console.error("Error fetching projects: ", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Endpoint per creare un nuovo progetto
app.post('/api/projects', async (req, res) => {
  const { title, description } = req.body;

  try {
    const newProject = {
      title,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('projects').add(newProject);

    res.status(201).json({ id: docRef.id, ...newProject });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});


// Endpoint per ottenere i dettagli di un singolo progetto
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;  // Ottieni l'ID dal parametro della URL

  try {
    const projectDoc = await db.collection("projects").doc(id).get();  // Recupera il documento con quell'ID
    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      id: projectDoc.id,
      ...projectDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching project: ", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});


// Endpoint per eliminare un progetto
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;  // Ottieni l'ID del progetto dalla URL

  try {
    const projectDoc = db.collection("projects").doc(id);
    const doc = await projectDoc.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    await projectDoc.delete();  // Elimina il documento
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project: ", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Endpoint per eliminare un progetto
app.put('/api/projects/:id', async (req, res) => {
  const projectId = req.params.id; // Ottieni l'ID dal parametro dell'URL
  const updatedProject = req.body; // I dati aggiornati vengono passati nel body della richiesta

  

  try {
    // Cerca il progetto nel database
    const projectRef = db.collection('projects').doc(projectId);

    // Controlla se il progetto esiste
    const doc = await projectRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Aggiorna il progetto con i nuovi dati
    await projectRef.update(updatedProject);

    // Restituisci la risposta di successo
    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});


// Endpoint per ottenere i task di un progetto
app.get("/api/projects/:id/tasks", async (req, res) => {
  const { id } = req.params;

  try {
    const tasksSnapshot = await db
      .collection("projects")
      .doc(id)
      .collection("tasks")
      .get();

    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Endpoint per eliminare una task di un progetto
app.delete("/api/projects/:projectId/tasks/:taskId", async (req, res) => {
  const { projectId, taskId } = req.params;  // Ottieni gli ID del progetto e della task dai parametri della URL

  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);  // Ottieni il riferimento alla task nel progetto specifico

    const taskDoc = await taskRef.get();
    
    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskRef.delete();  // Elimina la task
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task: ", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Endpoint per aggiornare una task di un progetto
app.put("/api/projects/:projectId/tasks/:taskId", async (req, res) => {
  // console.log('PUT request received');
  const { projectId, taskId } = req.params;
  const updatedTask = req.body;

  console.log(`Updating task ${taskId} in project ${projectId} with data:`, updatedTask); // Log per verificare i dati

  try {
    const taskRef = db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await taskRef.update(updatedTask);

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});



app.listen(8080, () => {
  console.log("Server started on port 8080");
});
