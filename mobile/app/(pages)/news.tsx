import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView, // Use ScrollView for tabs if horizontal scrolling is needed
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
} from 'react-native';
// Import appropriate icons
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; // Using FontAwesome for user avatar fallback

// --- News Article Data Structure ---
interface NewsArticle {
  id: number;
  title: string;
  content: string;
  plasturgieType: "Matériaux" | "Technologies" | "Recyclage" | "Autre";
  publishedAt: string; // ISO Date String
  webmasterName: string;
  webmasterAvatar?: string; // Optional avatar URL
}

// --- Mock News Data ---
const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: "Percée des polymères biodégradables : vers des plastiques plus verts",
    content: "Des chercheurs ont développé un nouveau polymère à base d'amidon qui se dégrade beaucoup plus rapidement dans des conditions environnementales normales, réduisant potentiellement les déchets plastiques dans les décharges et les océans. Le matériau présente une résistance comparable aux plastiques d'emballage traditionnels.",
    plasturgieType: "Matériaux",
    publishedAt: "2024-11-15T09:30:00Z",
    webmasterName: "Dr. Eva Rostova",
    webmasterAvatar: undefined,
  },
  {
    id: 2,
    title: "Système alimenté par IA optimise le processus d'extrusion en temps réel",
    content: "Un nouveau système utilisant des algorithmes d'apprentissage automatique surveille les données des capteurs des lignes d'extrusion pour prédire et prévenir les défauts, entraînant une réduction des taux de rebut et une amélioration de la cohérence des produits. Les premiers essais montrent une augmentation d'efficacité de 15%.",
    plasturgieType: "Technologies",
    publishedAt: "2024-11-14T14:00:00Z",
    webmasterName: "John Smith",
    webmasterAvatar: undefined,
  },
  {
    id: 3,
    title: "Les taux de recyclage du plastique atteignent un niveau record, mais des défis demeurent",
    content: "Des rapports récents indiquent un taux de recyclage global moyen approchant 20% pour les plastiques, stimulé par l'amélioration de l'infrastructure de collecte et les avancées du recyclage chimique. Cependant, la contamination et les emballages complexes multicouches continuent de poser des obstacles importants.",
    plasturgieType: "Recyclage",
    publishedAt: "2024-11-12T11:25:00Z",
    webmasterName: "Support Admin",
    webmasterAvatar: undefined,
  },
   {
    id: 4,
    title: "L'Académie Plasturgie-Nous lance un programme de certification avancé",
    content: "L'académie a annoncé une nouvelle filière de certification axée sur la science avancée des polymères et les pratiques de fabrication durable, visant à perfectionner les professionnels dans le paysage industriel en évolution.",
    plasturgieType: "Autre",
    publishedAt: "2024-11-10T08:00:00Z",
    webmasterName: "Équipe Académie",
    webmasterAvatar: undefined,
  },
   {
    id: 5,
    title: "Nouveau catalyseur améliore l'efficacité du recyclage du plastique PET",
    content: "Une équipe de recherche a découvert un nouveau catalyseur qui accélère considérablement le processus de glycolyse pour décomposer le plastique PET, rendant le recyclage plus économe en énergie et rentable.",
    plasturgieType: "Recyclage",
    publishedAt: "2024-11-09T16:45:00Z",
    webmasterName: "Science Aujourd'hui",
    webmasterAvatar: undefined,
  },
];

// --- Helper Functions ---

// Date Formatter
const formatFullDateTime = (dateString: string): string => {
    if (!dateString) return 'Date non disponible';
    try {
        const date = new Date(dateString);
         if (isNaN(date.getTime())) return 'Date invalide';
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: false,
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Erreur de formatage de date';
    }
};

// Category Badge Styling
type CategoryType = NewsArticle['plasturgieType'] | 'Toutes les actualités';
const getBadgeStyle = (category: CategoryType) => {
  switch (category) {
    case "Matériaux":
      return {
        backgroundColor: '#dbeafe', // blue-100
        textColor: '#1e40af',       // blue-800
        borderColor: '#bfdbfe',     // blue-200
      };
    case "Technologies":
      return {
        backgroundColor: '#f3e8ff', // purple-100
        textColor: '#581c87',       // purple-800
        borderColor: '#e9d5ff',     // purple-200
      };
    case "Recyclage":
      return {
        backgroundColor: '#dcfce7', // green-100
        textColor: '#166534',       // green-800
        borderColor: '#bbf7d0',     // green-200
      };
    case "Autre":
    default: // Default for 'Autre' and potentially 'Toutes les actualités' if needed
      return {
        backgroundColor: '#f3f4f6', // gray-100
        textColor: '#374151',       // gray-700
        borderColor: '#e5e7eb',     // gray-200
      };
  }
};

// Simple Avatar Fallback (Circle with Initial)
const renderWebmasterAvatar = (name: string, size: number = styles.authorAvatar.width) => {
    const initial = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2) : '?';
    // In real app, check for an avatar URL first
    return (
        <View style={[styles.authorAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
             {/* Use FontAwesome user icon as fallback visual */}
            <FontAwesome name="user" size={size * 0.5} color="#64748b" />
            {/* Or show initials: <Text style={styles.authorAvatarText}>{initial}</Text> */}
        </View>
    );
};

// --- News Categories ---
const newsCategories: CategoryType[] = ["Toutes les actualités", "Matériaux", "Technologies", "Recyclage", "Autre"];

// --- Main Component ---
const NewsScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Toutes les actualités");
    const [filteredNews, setFilteredNews] = useState<NewsArticle[]>(mockNews);

    // --- Filtering Logic ---
    useEffect(() => {
        if (selectedCategory === "Toutes les actualités") {
            setFilteredNews(mockNews);
        } else {
            const filtered = mockNews.filter(article => article.plasturgieType === selectedCategory);
            setFilteredNews(filtered);
        }
        // Scroll to top when category changes (optional)
        // flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [selectedCategory]);

    const flatListRef = useRef<FlatList>(null);

    // --- Render Functions ---

    // Render Filter Tab Button
    const renderFilterTab = (category: CategoryType) => {
        const isActive = selectedCategory === category;
        return (
            <TouchableOpacity
                key={category}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setSelectedCategory(category)}
            >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                    {category}
                </Text>
            </TouchableOpacity>
        );
    };

    // Render Category Badge Component
    const renderCategoryBadge = (category: NewsArticle['plasturgieType']) => {
         const style = getBadgeStyle(category);
         return (
            <View style={[styles.badge, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
                <Text style={[styles.badgeText, { color: style.textColor }]}>{category}</Text>
            </View>
         );
    };

    // Render News Article Card
    const renderArticleCard = ({ item }: { item: NewsArticle }) => {
        return (
            <View style={styles.articleCard}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                    {renderCategoryBadge(item.plasturgieType)}
                </View>

                {/* Title */}
                <Text style={styles.articleTitle}>{item.title}</Text>

                {/* Publication Date */}
                 <Text style={styles.publicationDate}>{formatFullDateTime(item.publishedAt)}</Text>


                {/* Content */}
                <Text style={styles.articleContent} numberOfLines={4} ellipsizeMode="tail">
                    {item.content}
                </Text>
                 {/* Add a "Read More" button if needed */}
                 {/* <TouchableOpacity><Text style={styles.readMore}>Lire la suite</Text></TouchableOpacity> */}


                {/* Footer */}
                <View style={styles.cardFooter}>
                    {renderWebmasterAvatar(item.webmasterName)}
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>{item.webmasterName}</Text>
                         {/* Optionally show timestamp again here, or relative time */}
                         {/* <Text style={styles.footerTimestamp}>Publié : {formatFullDateTime(item.publishedAt)}</Text> */}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                 <Text style={styles.headerTitle}>Actualités Plasturgie</Text>
            </View>

            {/* --- Filter Tabs --- */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
                    {newsCategories.map(renderFilterTab)}
                </ScrollView>
            </View>

            {/* --- News List or Empty State --- */}
            <FlatList
                ref={flatListRef}
                data={filteredNews}
                renderItem={renderArticleCard}
                keyExtractor={item => item.id.toString()}
                style={styles.listContainer}
                contentContainerStyle={styles.listContentContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyStateContainer}>
                         <MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={64} color={styles.colorMutedText.color} />
                         <Text style={styles.emptyStateTitle}>Aucun article trouvé</Text>
                         <Text style={styles.emptyStateText}>
                             Il n'y a aucun article correspondant à la catégorie "{selectedCategory}". Essayez de sélectionner une autre catégorie.
                         </Text>
                          <TouchableOpacity
                             style={styles.allNewsButton}
                             onPress={() => setSelectedCategory("Toutes les actualités")}
                           >
                             <Text style={styles.allNewsButtonText}>Voir toutes les actualités</Text>
                         </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    // Core Colors (reuse from previous theme)
    colorPrimaryText: { color: '#1e293b' },
    colorSecondaryText: { color: '#64748b' },
    colorMutedText: { color: '#94a3b8' },
    colorBackground: { backgroundColor: '#f8fafc' },
    colorCardBackground: { backgroundColor: '#ffffff' },
    colorBorder: { borderColor: '#e2e8f0' },
    colorAccent: { color: '#2563eb' },
    colorAccentBg: { backgroundColor: '#2563eb' },
    colorButtonTextLight: { color: '#ffffff'},
    colorSecondaryButtonBg: { backgroundColor: '#f1f5f9' },
    colorSecondaryButtonText: { color: '#334155'},

    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc', // Light Background
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#ffffff', // White header background
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b', // Primary Text
    },
    // Tabs Styles
    tabsContainer: {
        paddingBottom: 1, // Prevents ScrollView indicator overlap issues
        backgroundColor: '#ffffff', // White background for tabs row
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
     tabsScrollContent: {
        paddingVertical: 10,
        paddingHorizontal: 12, // Horizontal padding for the whole scroll view
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4, // Space between tabs
        borderRadius: 16, // Pill shape
        backgroundColor: '#f1f5f9', // Default background
        borderWidth: 1,
        borderColor: 'transparent', // No border by default
    },
    tabButtonActive: {
        backgroundColor: '#e0e7ff', // Active tab background (light blue)
        borderColor: '#a5b4fc', // Active tab border
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155', // Default text color
    },
    tabButtonTextActive: {
        color: '#1e3a8a', // Active text color (darker blue)
    },
    // List Styles
    listContainer: {
        flex: 1,
    },
    listContentContainer: {
        padding: 16,
    },
    // Article Card Styles
    articleCard: {
        backgroundColor: '#ffffff', // White card background
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0', // Light border
        padding: 16,
        marginBottom: 16, // Space between cards
        shadowColor: "#000", // Optional subtle shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
     // Badge Styles
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12, // Pill shape
        borderWidth: 1,
        alignSelf: 'flex-start', // Keep badge neat
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
     publicationDate: {
        fontSize: 12,
        color: '#94a3b8', // Muted text color
        marginBottom: 8,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: '600', // Semi-bold
        color: '#1e293b', // Primary Text
        marginBottom: 8, // Space below title
        lineHeight: 24,
    },
    articleContent: {
        fontSize: 14,
        color: '#4b5563', // Slightly darker secondary text
        lineHeight: 20,
        marginBottom: 16,
    },
     readMore: { // Optional "Read More" style
         color: '#2563eb', // Accent color
         fontWeight: '500',
         marginTop: -10, // Pull up slightly
         marginBottom: 16,
     },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9', // Very light separator
        paddingTop: 12,
    },
    authorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e2e8f0', // Placeholder background
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorAvatarText: { // If showing initials instead of icon
        color: '#64748b',
        fontWeight: 'bold',
        fontSize: 12,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#334155',
    },
    // footerTimestamp: { // Optional timestamp in footer
    //     fontSize: 11,
    //     color: '#94a3b8',
    // },
    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginTop: 40, // Add some space from filters
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#64748b', // Secondary text
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
     allNewsButton: { // Button to go back to all news
        backgroundColor: '#e0e7ff', // Light blue button
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#a5b4fc',
     },
     allNewsButtonText: {
         color: '#1e3a8a', // Darker blue text
         fontWeight: '500',
         fontSize: 14,
     },
});

export default NewsScreen;