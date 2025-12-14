import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  Tag,
  User,
  TrendingUp,
  Bell,
  Bookmark,
  ChevronDown
} from 'lucide-react';

const DashboardActualites = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('toutes');
  const [sortBy, setSortBy] = useState('date');

  // Données d'exemple pour les actualités
  const actualites = [
    {
      id: 1,
      titre: "🚀 Nouveau ! Maîtrisez les Bioplastiques avec notre Formation Inédite sur Plasturgie-Nous Academy !",
      resume: "Chez Plasturgie-Nous Academy, nous sommes ravis de vous annoncer le lancement de notre toute nouvelle formation : Introduction aux Bioplastiques et Matériaux Durables ! ♻️",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      categorie: "Formation",
      auteur: "Marie Dubois",
      datePublication: "2024-06-08",
      heurePublication: "14:30",
      vues: 1250,
      likes: 89,
      commentaires: 23,
      partages: 15,
      image: "data:image/jpeg;base64,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",
      statut: "publié",
      tags: ["IA", "Formation", "Technologie"]
    },
    {
      id: 2,
      titre: "Certification en Cybersécurité - Inscriptions ouvertes",
      resume: "Les inscriptions pour notre certification en cybersécurité sont maintenant ouvertes. Places limitées.",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      categorie: "Certification",
      auteur: "Jean Martin",
      datePublication: "2024-06-07",
      heurePublication: "09:15",
      vues: 987,
      likes: 64,
      commentaires: 18,
      partages: 12,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
      statut: "publié",
      tags: ["Cybersécurité", "Certification"]
    },
    {
      id: 3,
      titre: "Événement : Conférence sur l'Innovation Digitale",
      resume: "Rejoignez-nous le 15 juin pour une conférence exceptionnelle sur les dernières tendances de l'innovation digitale.",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      categorie: "Événement",
      auteur: "Sophie Laurent",
      datePublication: "2024-06-06",
      heurePublication: "16:45",
      vues: 2100,
      likes: 156,
      commentaires: 45,
      partages: 28,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      statut: "publié",
      tags: ["Innovation", "Digital", "Conférence"]
    },
    {
      id: 4,
      titre: "Témoignage : Réussite de nos apprenants",
      resume: "Découvrez l'histoire inspirante de nos anciens apprenants qui ont transformé leur carrière grâce à nos formations.",
      contenu: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      categorie: "Témoignage",
      auteur: "Pierre Morel",
      datePublication: "2024-06-05",
      heurePublication: "11:20",
      vues: 756,
      likes: 92,
      commentaires: 31,
      partages: 8,
      statut: "brouillon",
      tags: ["Témoignage", "Succès", "Carrière"]
    }
  ];

  const categories = ['toutes', 'Formation', 'Certification', 'Événement', 'Témoignage'];

  // Filtrage et tri des actualités
  const actualitesFiltrees = useMemo(() => {
    let filtered = actualites.filter(actualite => {
      const matchSearch = actualite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actualite.resume.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'toutes' || actualite.categorie === selectedCategory;
      return matchSearch && matchCategory;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime();
        case 'vues':
          return b.vues - a.vues;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  // Statistiques
  const stats = {
    total: actualites.length,
    publies: actualites.filter(a => a.statut === 'publié').length,
    brouillons: actualites.filter(a => a.statut === 'brouillon').length,
    vuesTotal: actualites.reduce((sum, a) => sum + a.vues, 0)
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actualités</h1>
            <p className="text-gray-600 mt-2">Gérez et publiez vos actualités</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Nouvelle actualité
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-green-600">{stats.publies}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-orange-600">{stats.brouillons}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vuesTotal.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une actualité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'toutes' ? 'Toutes les catégories' : cat}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Trier par date</option>
                <option value="vues">Trier par vues</option>
                <option value="likes">Trier par likes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des actualités */}
      <div className="space-y-4">
        {actualitesFiltrees.map((actualite) => (
          <div key={actualite.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                {actualite.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={actualite.image}
                      alt={actualite.titre}
                      className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Contenu */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          actualite.statut === 'publié' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {actualite.statut}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {actualite.categorie}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {actualite.titre}
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {actualite.resume}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {actualite.auteur}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(actualite.datePublication)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {actualite.heurePublication}
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {actualite.tags && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {actualite.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Menu actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Statistiques */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {actualite.vues.toLocaleString()} vues
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        {actualite.likes} likes
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        {actualite.commentaires} commentaires
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 size={14} />
                        {actualite.partages} partages
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Bookmark size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {actualitesFiltrees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune actualité trouvée</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}
    </div>
  );
};

export default DashboardActualites;