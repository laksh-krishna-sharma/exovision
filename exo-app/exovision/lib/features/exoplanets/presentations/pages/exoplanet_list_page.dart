import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/space_background.dart';
import '../../../../shared/widgets/common/navbar_fixed.dart';
import '../widgets/exoplanet_card.dart';

class ExoplanetListPage extends StatefulWidget {
  const ExoplanetListPage({super.key});

  @override
  State<ExoplanetListPage> createState() => _ExoplanetListPageState();
}

class _ExoplanetListPageState extends State<ExoplanetListPage> {
  final _scrollController = ScrollController();
  String _searchQuery = '';
  String _selectedFilter = 'All';
  final List<String> _filters = ['All', 'Habitable', 'Gas Giants', 'Rocky Planets', 'Neptunian', 'Super-Earths'];
  
  bool _isLoading = false;
  final List<Map<String, dynamic>> _exoplanets = [];
  final List<String> _favorites = [];

  @override
  void initState() {
    super.initState();
    _loadExoplanets();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadExoplanets() async {
    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    await Future.delayed(const Duration(seconds: 2));

    // Sample exoplanet data - using Map for simplicity
    final sampleExoplanets = [
      {
        'id': 'trappist-1e',
        'name': 'TRAPPIST-1e',
        'discoveryMethod': 'Transit',
        'discoveryYear': 2017,
        'planetRadius': 0.92,
        'planetMass': 0.69,
        'equilibriumTemperature': 251.0,
        'hostStar': 'TRAPPIST-1',
        'distanceFromEarth': 39.5,
        'isHabitable': true,
        'description': 'A potentially habitable exoplanet in the TRAPPIST-1 system.',
        'imageUrl': '',
        'rating': 4.5,
      },
      {
        'id': 'kepler-186f',
        'name': 'Kepler-186f',
        'discoveryMethod': 'Transit',
        'discoveryYear': 2014,
        'planetRadius': 1.17,
        'planetMass': 1.44,
        'equilibriumTemperature': 188.0,
        'hostStar': 'Kepler-186',
        'distanceFromEarth': 582.0,
        'isHabitable': true,
        'description': 'First Earth-sized planet in the habitable zone.',
        'imageUrl': '',
        'rating': 4.2,
      },
      {
        'id': 'hd-209458b',
        'name': 'HD 209458b',
        'discoveryMethod': 'Transit',
        'discoveryYear': 1999,
        'planetRadius': 1.38,
        'planetMass': 0.69,
        'equilibriumTemperature': 1130.0,
        'hostStar': 'HD 209458',
        'distanceFromEarth': 159.0,
        'isHabitable': false,
        'description': 'First exoplanet discovered by the transit method.',
        'imageUrl': '',
        'rating': 3.8,
      },
    ];

    setState(() {
      _exoplanets.addAll(sampleExoplanets);
      _isLoading = false;
    });
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
  }

  void _onFilterChanged(String filter) {
    setState(() {
      _selectedFilter = filter;
    });
  }

  void _onExoplanetTap(String exoplanetId) {
    context.go('/exoplanet/$exoplanetId');
  }

  void _onToggleFavorite(String exoplanetId) {
    setState(() {
      if (_favorites.contains(exoplanetId)) {
        _favorites.remove(exoplanetId);
      } else {
        _favorites.add(exoplanetId);
      }
    });
  }

  void _onViewFavorites() {
    context.go('/favorites');
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;

    return Scaffold(
      body: Stack(
        children: [
          const SpaceBackground(),
          Column(
            children: [
              NavbarFixed(
                title: 'Exoplanets',
                showBackButton: true,
                onBackTap: () => context.go('/home'),
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.all(isMobile ? 16 : 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeaderSection(isMobile),
                      SizedBox(height: isMobile ? 20 : 32),
                      _buildSearchSection(isMobile),
                      SizedBox(height: isMobile ? 20 : 32),
                      _buildExoplanetsGrid(isMobile),
                    ],
                  ),
                ),
              ),
            ],
          ),
          if (_isLoading) _buildLoadingOverlay(),
        ],
      ),
    );
  }

  Widget _buildHeaderSection(bool isMobile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Explore Exoplanets',
              style: isMobile
                  ? TextStyles.headlineSmall.copyWith(fontWeight: FontWeight.w700)
                  : TextStyles.headlineMedium.copyWith(fontWeight: FontWeight.w700),
            ),
            GestureDetector(
              onTap: _onViewFavorites,
              child: Container(
                padding: EdgeInsets.symmetric(
                  horizontal: isMobile ? 16 : 20,
                  vertical: isMobile ? 10 : 12,
                ),
                decoration: BoxDecoration(
                  color: AppColors.cyan.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.cyan.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.favorite,
                      color: AppColors.cyan,
                      size: isMobile ? 16 : 18,
                    ),
                    SizedBox(width: isMobile ? 6 : 8),
                    Text(
                      'Favorites',
                      style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                          .copyWith(color: AppColors.cyan, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: isMobile ? 8 : 12),
        Text(
          'Discover ${_exoplanets.length} planets beyond our solar system',
          style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
              .copyWith(color: Colors.white.withOpacity(0.7)),
        ),
      ],
    ).animate(delay: 300.ms).fadeIn().slideY(begin: -0.3);
  }

  Widget _buildSearchSection(bool isMobile) {
    return Column(
      children: [
        Container(
          height: isMobile ? 50 : 56,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withOpacity(0.1),
              width: 1,
            ),
          ),
          child: Row(
            children: [
              SizedBox(width: isMobile ? 16 : 20),
              Icon(
                Icons.search,
                color: Colors.white.withOpacity(0.6),
                size: isMobile ? 20 : 24,
              ),
              SizedBox(width: isMobile ? 12 : 16),
              Expanded(
                child: TextField(
                  onChanged: _onSearchChanged,
                  style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                      .copyWith(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search exoplanets...',
                    hintStyle: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                        .copyWith(color: Colors.white.withOpacity(0.4)),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.zero,
                  ),
                  cursorColor: AppColors.cyan,
                ),
              ),
              if (_searchQuery.isNotEmpty)
                GestureDetector(
                  onTap: () => _onSearchChanged(''),
                  child: Container(
                    padding: EdgeInsets.all(isMobile ? 6 : 8),
                    margin: EdgeInsets.only(right: isMobile ? 12 : 16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.close,
                      color: Colors.white.withOpacity(0.6),
                      size: isMobile ? 16 : 18,
                    ),
                  ),
                ),
            ],
          ),
        ),
        SizedBox(height: isMobile ? 12 : 16),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: _filters.map((filter) {
              final isSelected = filter == _selectedFilter;
              return Padding(
                padding: EdgeInsets.only(right: isMobile ? 8 : 12),
                child: GestureDetector(
                  onTap: () => _onFilterChanged(filter),
                  child: Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: isMobile ? 16 : 20,
                      vertical: isMobile ? 10 : 12,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.cyan : Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(25),
                      border: Border.all(
                        color: isSelected ? AppColors.cyan : Colors.white.withOpacity(0.1),
                        width: 1,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: AppColors.cyan.withOpacity(0.3),
                                blurRadius: 10,
                                spreadRadius: 2,
                              ),
                            ]
                          : [],
                    ),
                    child: Text(
                      filter,
                      style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium).copyWith(
                        color: isSelected ? Colors.black : Colors.white.withOpacity(0.8),
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                  ),
                ).animate(delay: (600 + (_filters.indexOf(filter) * 50)).ms).fadeIn().slideX(begin: 0.3),
              );
            }).toList(),
          ),
        ),
      ],
    ).animate(delay: 500.ms).fadeIn().slideX(begin: 0.3);
  }

  Widget _buildExoplanetsGrid(bool isMobile) {
    final filteredExoplanets = _exoplanets.where((exoplanet) {
      final matchesSearch = _searchQuery.isEmpty ||
          exoplanet['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          exoplanet['discoveryMethod'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (exoplanet['hostStar'] != null && exoplanet['hostStar'].toString().toLowerCase().contains(_searchQuery.toLowerCase()));
      
      final matchesFilter = _selectedFilter == 'All' ||
          (_selectedFilter == 'Habitable' && exoplanet['isHabitable'] == true) ||
          (_selectedFilter == 'Gas Giants' && exoplanet['planetRadius'] != null && exoplanet['planetRadius'] > 4.0) ||
          (_selectedFilter == 'Rocky Planets' && exoplanet['planetRadius'] != null && exoplanet['planetRadius'] <= 2.0) ||
          (_selectedFilter == 'Neptunian' && exoplanet['planetRadius'] != null && exoplanet['planetRadius'] > 2.0 && exoplanet['planetRadius'] <= 4.0) ||
          (_selectedFilter == 'Super-Earths' && exoplanet['planetRadius'] != null && exoplanet['planetRadius'] > 1.0 && exoplanet['planetRadius'] <= 2.0);
      
      return matchesSearch && matchesFilter;
    }).toList();

    if (_isLoading && _exoplanets.isEmpty) {
      return _buildLoadingState(isMobile);
    }

    if (filteredExoplanets.isEmpty) {
      return _buildEmptyState(isMobile);
    }

    return Expanded(
      child: GridView.builder(
        controller: _scrollController,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: isMobile ? 1 : 2,
          crossAxisSpacing: isMobile ? 16 : 24,
          mainAxisSpacing: isMobile ? 16 : 24,
          childAspectRatio: isMobile ? 1.6 : 1.8,
        ),
        itemCount: filteredExoplanets.length,
        itemBuilder: (context, index) {
          final exoplanet = filteredExoplanets[index];
          final isFavorite = _favorites.contains(exoplanet['id']);
          
          return ExoplanetCard(
            exoplanet: exoplanet,
            onTap: () => _onExoplanetTap(exoplanet['id']),
            onFavoriteToggle: () => _onToggleFavorite(exoplanet['id']),
            isFavorite: isFavorite,
            isMobile: isMobile,
          ).animate(delay: (700 + (index * 100)).ms).fadeIn().slideY(
            begin: 0.5,
            curve: Curves.easeOut,
          );
        },
      ),
    );
  }

  Widget _buildLoadingState(bool isMobile) {
    return Expanded(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: isMobile ? 40 : 60,
              height: isMobile ? 40 : 60,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                color: AppColors.cyan,
              ),
            ),
            SizedBox(height: isMobile ? 16 : 24),
            Text(
              'Discovering Exoplanets...',
              style: (isMobile ? TextStyles.titleMedium : TextStyles.titleLarge)
                  .copyWith(color: Colors.white),
            ),
            SizedBox(height: isMobile ? 8 : 12),
            Text(
              'Scanning the cosmos for distant worlds',
              style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                  .copyWith(color: Colors.white.withOpacity(0.6)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool isMobile) {
    return Expanded(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: isMobile ? 60 : 80,
              color: Colors.white.withOpacity(0.3),
            ),
            SizedBox(height: isMobile ? 16 : 24),
            Text(
              'No exoplanets found',
              style: (isMobile ? TextStyles.titleMedium : TextStyles.titleLarge)
                  .copyWith(color: Colors.white.withOpacity(0.5)),
            ),
            SizedBox(height: isMobile ? 8 : 12),
            Text(
              'Try adjusting your search or filter',
              style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                  .copyWith(color: Colors.white.withOpacity(0.4)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingOverlay() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: 40,
                height: 40,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  color: AppColors.cyan,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Loading Exoplanets...',
                style: TextStyles.bodyMedium.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}