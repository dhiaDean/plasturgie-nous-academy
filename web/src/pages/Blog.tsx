
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Calendar, User, Tag, ArrowRight, Bookmark } from "lucide-react";

const Blog = () => {
  // Mock data - would come from an API in a real application
  const blogPosts = [
    {
      id: 1,
      title: "Les dernières innovations en matière de moules d'injection",
      excerpt: "Découvrez comment les avancées technologiques transforment la conception et la fabrication des moules d'injection plastique.",
      category: "Plasturgie",
      date: "15 Mars 2025",
      author: "Sophie Dupont",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "Comment optimiser la consommation d'énergie dans l'industrie plastique",
      excerpt: "Stratégies pratiques pour réduire la consommation d'énergie et minimiser l'impact environnemental de la production de plastique.",
      category: "Développement durable",
      date: "10 Mars 2025",
      author: "Karim Benzarti",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      readTime: "8 min"
    },
    {
      id: 3,
      title: "Formation continue : un atout majeur pour les techniciens en plasturgie",
      excerpt: "L'importance de la formation continue pour rester compétitif dans le secteur en constante évolution de la plasturgie.",
      category: "Formation",
      date: "28 Février 2025",
      author: "Ahmed Khaled",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Les certifications essentielles pour les professionnels de l'industrie plastique",
      excerpt: "Guide complet des certifications qui peuvent faire progresser votre carrière dans l'industrie plastique.",
      category: "Carrière",
      date: "20 Février 2025",
      author: "Leila Ben Salah",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      readTime: "7 min"
    }
  ];

  const categories = [
    { name: "Plasturgie", count: 12 },
    { name: "Technique", count: 8 },
    { name: "Formation", count: 15 },
    { name: "Développement durable", count: 6 },
    { name: "Carrière", count: 9 },
    { name: "Tendances", count: 7 }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Blog Header */}
        <div className="bg-gradient-to-r from-tunisiaBlue-600 to-tunisiaTeal-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Blog Tunisia Formation</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Découvrez nos articles, astuces et actualités sur le monde de la formation et de l'industrie plastique.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Input 
                placeholder="Rechercher un article..." 
                className="pl-10 py-6 text-black rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tous les articles</TabsTrigger>
                  <TabsTrigger value="plasturgie">Plasturgie</TabsTrigger>
                  <TabsTrigger value="technique">Technique</TabsTrigger>
                  <TabsTrigger value="formation">Formation</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <CardHeader>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="bg-tunisiaBlue-100 text-tunisiaBlue-800 px-2 py-1 rounded-full text-xs">
                              {post.category}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              {post.date}
                            </span>
                          </div>
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-3 w-3 mr-1" /> 
                            {post.author}
                            <span className="mx-2">•</span>
                            {post.readTime} de lecture
                          </div>
                          <Button variant="ghost" size="sm" className="text-tunisiaBlue-600">
                            Lire <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button variant="outline">Voir plus d'articles</Button>
                  </div>
                </TabsContent>

                <TabsContent value="plasturgie" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts
                      .filter(post => post.category === "Plasturgie")
                      .map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                          <CardHeader>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span className="bg-tunisiaBlue-100 text-tunisiaBlue-800 px-2 py-1 rounded-full text-xs">
                                {post.category}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> 
                                {post.date}
                              </span>
                            </div>
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                            <CardDescription>{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-3 w-3 mr-1" /> 
                              {post.author}
                              <span className="mx-2">•</span>
                              {post.readTime} de lecture
                            </div>
                            <Button variant="ghost" size="sm" className="text-tunisiaBlue-600">
                              Lire <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="technique" className="mt-6">
                  <p className="text-center py-12 text-gray-500">Aucun article dans cette catégorie pour le moment.</p>
                </TabsContent>

                <TabsContent value="formation" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts
                      .filter(post => post.category === "Formation")
                      .map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                          <CardHeader>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span className="bg-tunisiaBlue-100 text-tunisiaBlue-800 px-2 py-1 rounded-full text-xs">
                                {post.category}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> 
                                {post.date}
                              </span>
                            </div>
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                            <CardDescription>{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-3 w-3 mr-1" /> 
                              {post.author}
                              <span className="mx-2">•</span>
                              {post.readTime} de lecture
                            </div>
                            <Button variant="ghost" size="sm" className="text-tunisiaBlue-600">
                              Lire <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link 
                          to="#" 
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-tunisiaBlue-500" />
                            <span>{category.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">{category.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Articles populaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Restez informé de nos derniers articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Votre email" />
                    <Button className="w-full">S'abonner</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
