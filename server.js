const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 10000; // ✅ Compatible avec Render

// ✅ Webhook Discord
const webhookUrl = "https://discord.com/api/webhooks/1368323896004055081/b5cUk80DW7HofsCl98Yr6jNbI5SP94WRugcD1k9hh5Xu-sBYeH71_0bg6Gq6sg_J4JX3";

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Sert les fichiers du dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// ✅ Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Route vers page de remerciement
app.get("/merci", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "merci.html"));
});

// ✅ Route pour le formulaire de dépôt
app.post("/depot", async (req, res) => {
  const { nom, prenom, contact, infraction, plainte, preuve } = req.body;

  const embed = {
    title: "📄 Nouveau dépôt de plainte",
    color: 0x3498db,
    thumbnail: {
      url: "https://download.logo.wine/logo/National_Gendarmerie/National_Gendarmerie-Logo.wine.png"
    },
    fields: [
      { name: "👤 Nom", value: nom || "Non renseigné", inline: true },
      { name: "👥 Prénom", value: prenom || "Non renseigné", inline: true },
      { name: "📞 Contact", value: contact || "Non fourni" },
      { name: "⚖️ Infraction", value: infraction || "Non spécifiée" },
      { name: "📝 Plainte", value: plainte || "Non spécifiée" },
      { name: "📎 Preuve", value: preuve || "Aucune" },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "Banlieu13 RP - Serveur RP",
    },
  };

  try {
    await axios.post(webhookUrl, { embeds: [embed] });
    res.redirect("/merci"); // ✅ Doit correspondre à la route GET "/merci"
  } catch (err) {
    console.error("Erreur Discord :", err);
    res.status(500).send("Erreur lors de l’envoi de la plainte.");
  }
});

// ✅ Lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur actif sur http://localhost:${port}`);
});
