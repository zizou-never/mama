// ===============================================
//           CODE DE DIAGNOSTIC UNIQUEMENT
// ===============================================

console.log("Début du script de diagnostic...");

// 1. Configuration (Ne pas modifier)
const SUPABASE_URL = '%VITE_SUPABASE_URL%';
const SUPABASE_ANON_KEY = '%VITE_SUPABASE_ANON_KEY%';

try {
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Client Supabase initialisé avec succès.");

    // 2. Fonction de test
    async function testSupabaseConnection() {
        console.log("Tentative de récupération des données de la table 'qcm'...");

        // On essaie de récupérer TOUTES les questions (plus simple qu'un appel RPC pour le test)
        const { data, error } = await supabase.from('qcm').select('*');

        // 3. Afficher le résultat dans la console
        if (error) {
            console.error("====== ERREUR DÉTECTÉE ======");
            console.error("L'erreur vient de Supabase:", error);
            document.body.innerHTML = `<h1>Erreur de connexion à la base de données</h1><p>Veuillez vérifier la console (F12) pour les détails.</p><pre>${JSON.stringify(error, null, 2)}</pre>`;
        } else {
            console.log("====== CONNEXION RÉUSSIE ======");
            console.log("Données reçues:", data);
            document.body.innerHTML = `<h1>Connexion réussie !</h1><p>${data.length} questions trouvées dans la base de données.</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
    }

    // Lancer le test
    testSupabaseConnection();

} catch (e) {
    console.error("====== ERREUR CRITIQUE ======");
    console.error("Impossible d'initialiser le client Supabase. Vérifiez les variables d'environnement.", e);
    document.body.innerHTML = `<h1>Erreur critique d'initialisation</h1><p>Le script n'a pas pu créer le client Supabase. Les variables d'environnement sont probablement incorrectes.</p>`;
}
