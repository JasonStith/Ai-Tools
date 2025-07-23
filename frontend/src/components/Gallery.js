import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Gallery = () => {
  const [selectedTab, setSelectedTab] = useState('top_month');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'top_month', label: 'Top Month', icon: '🔥' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'recent', label: 'Recent', icon: '🆕' },
    { id: 'featured', label: 'Featured', icon: '⭐' }
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'characters', label: 'Characters' },
    { id: 'environments', label: 'Environments' },
    { id: 'storyboards', label: 'Storyboards' },
    { id: 'music', label: 'Music' },
    { id: 'animations', label: 'Animations' }
  ];

  // Mock gallery data - in real app this would come from API
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        type: 'character',
        title: 'Cyberpunk Detective',
        creator: 'Alex Chen',
        likes: 342,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDMwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDA5OWZmIDAlLCAjZmYwMGZmIDEwMCUpIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DeWJlcnB1bmsgRGV0ZWN0aXZlPC90ZXh0Pgo8L3N2Zz4=',
        aspect: 'portrait'
      },
      {
        id: 2,
        type: 'environment',
        title: 'Neon City Streets',
        creator: 'Sarah Kim',
        likes: 128,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmYwMGZmIDAlLCAjMDBmZmZmIDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OZW9uIENpdHkgU3RyZWV0czwvdGV4dD4KPC9zdmc+',
        aspect: 'landscape'
      },
      {
        id: 3,
        type: 'script',
        title: 'Space Opera Script',
        creator: 'Mike Torres',
        likes: 89,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmZmY5MDAgMCUsICNmZjAwOTkgMTAwJSkiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHA+U2NyaXB0PC9wPgo8L3N2Zz4KPHN2ZyB4PSI3NSIgeT0iMTc1IiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTUwIDUwIiBmaWxsPSJ3aGl0ZSI+CjxwPnNwYWNlIG9wZXJhPC9wPgo8L3N2Zz4KPC9zdmc+',
        aspect: 'square'
      },
      {
        id: 4,
        type: 'character',
        title: 'Medieval Knight',
        creator: 'Emma Stone',
        likes: 456,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjOTk5OTk5IDAlLCAjMzMzMzMzIDEwMCUpIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NZWRpZXZhbCBLbmlnaHQ8L3RleHQ+Cjwvc3ZnPg==',
        aspect: 'portrait'
      },
      {
        id: 5,
        type: 'environment',
        title: 'Alien Landscape',
        creator: 'David Wilson',
        likes: 234,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQ1MCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NTAiIGhlaWdodD0iMzAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjNjYwMGZmIDAlLCAjZmY2NjAwIDEwMCUpIi8+Cjx0ZXh0IHg9IjIyNSIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGllbiBMYW5kc2NhcGU8L3RleHQ+Cjwvc3ZnPg==',
        aspect: 'landscape'
      },
      {
        id: 6,
        type: 'storyboard',
        title: 'Action Sequence',
        creator: 'Lisa Park',
        likes: 167,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDMwMCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzUwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmZjMzMDAgMCUsICMzMzAwZmYgMTAwJSkiLz4KPHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIiB2aWV3Qm94PSIwIDAgMjAwIDI1MCIgZmlsbD0id2hpdGUiPgo8cD5BY3Rpb24gU2VxdWVuY2U8L3A+CjxwPnN0b3J5Ym9hcmQ8L3A+Cjwvc3ZnPgo8L3N2Zz4=',
        aspect: 'portrait'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setGalleryItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = galleryItems.filter(item => 
    selectedFilter === 'all' || item.type === selectedFilter
  );

  const getMasonryColumns = () => {
    return {
      default: 4,
      1100: 3,
      700: 2,
      500: 1
    };
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Community Gallery</h1>
                <p className="text-gray-400">Discover amazing AI-generated content from our community</p>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 w-fit">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedTab === tab.id
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-dark-800 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid mb-4"
              >
                <div className="bg-dark-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                          </svg>
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-dark-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-1 truncate">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">by {item.creator}</p>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-sm">{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later for new content.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!loading && filteredItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="text-center">
            <motion.button
              className="bg-dark-800 hover:bg-dark-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 border border-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;