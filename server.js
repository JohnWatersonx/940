const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000; // Render utilise le port d'environnement

// ✅ Webhook Discord
const webhookUrl = "https://discord.com/api/webhooks/1368323896004055081/b5cUk80DW7HofsCl98Yr6jNbI5SP94WRugcD1k9hh5Xu-sBYeH71_0bg6Gq6sg_J4JX3";

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Sert les fichiers HTML/CSS/JS

// 🔘 Page d'accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📩 Traitement du formulaire
app.post("/depot", async (req, res) => {
    const { nom, prenom, contact, infraction, plainte, preuve } = req.body;

    console.log("📨 Reçu :", req.body);

    const embed = {
        title: "📋 Nouvelle plainte reçue",
        color: 16711680,
        fields: [
            { name: "👤 Nom", value: nom || "Non renseigné", inline: true },
            { name: "👤 Prénom", value: prenom || "Non renseigné", inline: true },
            { name: "📞 Contact", value: contact || "Non renseigné", inline: true },
            { name: "⚖️ Infraction", value: infraction || "Non renseignée", inline: false },
            { name: "📝 Plainte", value: plainte || "Non renseignée", inline: false },
            { name: "📎 Preuve", value: preuve || "Non fournie", inline: false }
        ],
        timestamp: new Date().toISOString()
    };

    try {
        await axios.post(webhookUrl, {
            embeds: [embed]
        });

        res.send("✅ Plainte envoyée avec succès !");
    } catch (error) {
        console.error("❌ Erreur Discord :", error.response ? error.response.data : error.message);
        res.status(500).send("Erreur lors de l’envoi de la plainte.");
    }
});

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
