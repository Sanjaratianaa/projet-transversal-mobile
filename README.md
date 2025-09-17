erDiagram
    %% Utilisateurs et Authentification
    utilisateurs {
        int id PK
        varchar nom
        varchar prenoms
        varchar email UK
        varchar mot_de_passe
        varchar telephone
        varchar langue
        timestamp date_creation
        varchar statut
    }
    
    roles {
        int id PK
        varchar libelle
    }
    
    permissions {
        int id PK
        varchar libelle
    }
    
    user_roles {
        int id_user FK
        int id_role FK
    }
    
    role_permissions {
        int id_role FK
        int id_perm FK
    }
    
    historique_actions {
        int id PK
        int id_user FK
        varchar type_action
        timestamp date_action
        text details
    }
    
    %% Catégories et Classifications
    categories {
        int id PK
        varchar libelle
        varchar type
    }
    
    %% Gestion Financière
    factures {
        int id PK
        int id_user FK
        varchar fournisseur
        varchar type_facture
        decimal montant
        date date_emission
        date date_echeance
        varchar statut
        varchar moyen_paiement
    }
    
    depenses {
        int id PK
        int id_user FK
        int id_cat FK
        text description
        decimal montant
        date date_depense
        varchar type_depense
        varchar statut
    }
    
    revenus {
        int id PK
        int id_user FK
        varchar source
        decimal montant
        date date_revenu
        varchar mode
    }
    
    %% Gestion des Prêts
    prets {
        int id PK
        int id_user FK
        varchar crediteur
        decimal montant
        decimal taux_interet
        date date_pret
        date echeance
        varchar statut
    }
    
    remboursements {
        int id PK
        int id_pret FK
        decimal montant
        date date_remb
        varchar statut
    }
    
    %% Objectifs et Budgets
    objectifs {
        int id PK
        int id_user FK
        varchar libelle
        decimal montant_total
        decimal montant_actuel
        date date_debut
        date date_fin
        varchar statut
    }
    
    budgets {
        int id PK
        int id_user FK
        int id_cat FK
        decimal montant_limite
        varchar periode
    }
    
    %% Recommandations et IA
    recommandations {
        int id PK
        int id_user FK
        text description
        varchar type
        timestamp date_creation
    }
    
    %% Notifications
    notifications {
        int id PK
        int id_user FK
        varchar type
        text message
        timestamp date_notif
        varchar statut
    }
    
    parametres_notif {
        int id PK
        int id_user FK
        varchar canal
        varchar frequence
    }
    
    %% Synchronisation et Sauvegarde
    devices {
        int id PK
        int id_user FK
        varchar type
        varchar statut
        timestamp last_sync
    }
    
    sauvegardes {
        int id PK
        int id_user FK
        timestamp date_save
        varchar type
    }
    
    %% Gamification
    badges {
        int id PK
        varchar libelle
        text description
    }
    
    user_badges {
        int id_user FK
        int id_badge FK
        date date_obtention
    }
    
    %% Fichiers
    fichiers {
        int id PK
        int id_facture FK
        text chemin_fichier
        varchar type_mime
    }
    
    %% Relations principales
    utilisateurs ||--o{ factures : "possede"
    utilisateurs ||--o{ depenses : "effectue"
    utilisateurs ||--o{ revenus : "recoit"
    utilisateurs ||--o{ prets : "contracte"
    utilisateurs ||--o{ objectifs : "definit"
    utilisateurs ||--o{ recommandations : "recoit"
    utilisateurs ||--o{ notifications : "recoit"
    utilisateurs ||--o{ parametres_notif : "configure"
    utilisateurs ||--o{ devices : "utilise"
    utilisateurs ||--o{ sauvegardes : "cree"
    utilisateurs ||--o{ budgets : "etablit"
    utilisateurs ||--o{ historique_actions : "genere"
    
    %% Relations de classification
    categories ||--o{ depenses : "categorise"
    categories ||--o{ budgets : "limite"
    
    %% Relations de remboursement
    prets ||--o{ remboursements : "rembourse"
    
    %% Relations de fichiers
    factures ||--o{ fichiers : "contient"
    
    %% Relations de rôles et permissions
    utilisateurs ||--o{ user_roles : "assigne"
    roles ||--o{ user_roles : "accorde"
    roles ||--o{ role_permissions : "possede"
    permissions ||--o{ role_permissions : "autorise"
    
    %% Relations de gamification
    utilisateurs ||--o{ user_badges : "obtient"
    badges ||--o{ user_badges : "recompense"
