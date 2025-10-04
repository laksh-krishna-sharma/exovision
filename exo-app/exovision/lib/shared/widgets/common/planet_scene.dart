import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class PlanetScene extends StatefulWidget {
  final bool animate;
  final double planetSize;

  const PlanetScene({
    super.key,
    this.animate = true,
    this.planetSize = 200,
  });

  @override
  State<PlanetScene> createState() => _PlanetSceneState();
}

class _PlanetSceneState extends State<PlanetScene>
    with SingleTickerProviderStateMixin {
  late AnimationController _rotationController;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    
    _rotationController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();

    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(_rotationController);
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;

    return Stack(
      children: [
        // Space Background
        _buildSpaceBackground(),

        // Animated Planets
        _buildPlanets(screenSize, isMobile),

        // Stars Overlay
        _buildStars(),

        // Gradient Overlay for depth
        _buildGradientOverlay(),
      ],
    );
  }

  Widget _buildSpaceBackground() {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.center,
          radius: 1.5,
          colors: [
            Color(0xFF0A0E17),
            Color(0xFF0F1525),
            Color(0xFF1A1F2E),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanets(Size screenSize, bool isMobile) {
    final planetSize = isMobile 
        ? widget.planetSize * 0.7 
        : widget.planetSize;

    return Positioned(
      top: screenSize.height * 0.4,
      left: screenSize.width * 0.5 - planetSize / 2,
      child: AnimatedBuilder(
        animation: _rotationAnimation,
        builder: (context, child) {
          return Transform.rotate(
            angle: widget.animate ? _rotationAnimation.value : 0,
            child: child,
          );
        },
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Main Planet with glow
            _buildMainPlanet(planetSize),
            
            // Orbiting moon
            _buildOrbitingMoon(planetSize),
            
            // Ring around planet
            _buildPlanetRing(planetSize),
          ],
        ),
      ),
    );
  }

  Widget _buildMainPlanet(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(
          center: Alignment(-0.3, -0.3),
          radius: 0.8,
          colors: [
            Color(0xFF4A90E2),
            Color(0xFF2C5282),
            Color(0xFF1A365D),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4A90E2).withOpacity(0.6),
            blurRadius: 40,
            spreadRadius: 10,
          ),
          BoxShadow(
            color: const Color(0xFF00D4FF).withOpacity(0.3),
            blurRadius: 60,
            spreadRadius: 20,
          ),
        ],
      ),
      child: Stack(
        children: [
          // Planet details (craters, etc.)
          _buildPlanetDetails(size),
        ],
      ),
    );
  }

  Widget _buildPlanetDetails(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: Alignment(0.4, 0.4),
          radius: 0.9,
          colors: [
            Colors.transparent,
            Colors.black.withOpacity(0.3),
          ],
        ),
      ),
      child: CustomPaint(
        painter: _PlanetDetailPainter(size: size),
      ),
    );
  }

  Widget _buildOrbitingMoon(double planetSize) {
    final moonSize = planetSize * 0.2;

    return AnimatedBuilder(
      animation: _rotationController,
      builder: (context, child) {
        final angle = _rotationController.value * 2 * pi * 2; // Faster rotation
        final distance = planetSize * 0.8;
        
        return Transform.translate(
          offset: Offset(
            cos(angle) * distance,
            sin(angle) * distance,
          ),
          child: child,
        );
      },
      child: Container(
        width: moonSize,
        height: moonSize,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: const Color(0xFFE2E8F0),
          boxShadow: [
            BoxShadow(
              color: Colors.white.withOpacity(0.5),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanetRing(double planetSize) {
    return AnimatedBuilder(
      animation: _rotationController,
      builder: (context, child) {
        return Transform.rotate(
          angle: _rotationController.value * pi * 0.5,
          child: child,
        );
      },
      child: Container(
        width: planetSize * 1.8,
        height: planetSize * 0.3,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(planetSize * 0.15),
          border: Border.all(
            color: const Color(0xFF9D4EDD).withOpacity(0.6),
            width: 4,
          ),
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              const Color(0xFF9D4EDD).withOpacity(0.8),
              const Color(0xFF00D4FF).withOpacity(0.4),
              Colors.transparent,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStars() {
    return SizedBox.expand(
      child: CustomPaint(
        painter: _StarFieldPainter(),
      ),
    );
  }

  Widget _buildGradientOverlay() {
    return SizedBox.expand(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.transparent,
              Colors.transparent,
              const Color(0xFF0A0E17).withOpacity(0.8),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _rotationController.dispose();
    super.dispose();
  }
}

class _PlanetDetailPainter extends CustomPainter {
  final double size;

  _PlanetDetailPainter({required this.size});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black.withOpacity(0.4)
      ..style = PaintingStyle.fill;

    final random = Random(42); // Fixed seed for consistent details

    // Draw some craters
    for (int i = 0; i < 8; i++) {
      final craterSize = this.size * (0.05 + random.nextDouble() * 0.08);
      final x = (random.nextDouble() - 0.5) * this.size * 0.8;
      final y = (random.nextDouble() - 0.5) * this.size * 0.8;

      canvas.drawCircle(
        Offset(x, y),
        craterSize,
        paint,
      );

      // Crater highlight
      canvas.drawCircle(
        Offset(x - craterSize * 0.3, y - craterSize * 0.3),
        craterSize * 0.3,
        Paint()
          ..color = Colors.white.withOpacity(0.1)
          ..style = PaintingStyle.fill,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _StarFieldPainter extends CustomPainter {
  final Random _random = Random(123); // Fixed seed for consistent stars
  final List<Star> _stars = [];

  _StarFieldPainter() {
    _generateStars();
  }

  void _generateStars() {
    for (int i = 0; i < 150; i++) {
      _stars.add(Star(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 1.5 + 0.5,
        opacity: _random.nextDouble() * 0.8 + 0.2,
      ));
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    for (final star in _stars) {
      paint.color = Colors.white.withOpacity(star.opacity);
      
      final x = star.x * size.width;
      final y = star.y * size.height;
      
      canvas.drawCircle(Offset(x, y), star.size, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class Star {
  final double x;
  final double y;
  final double size;
  final double opacity;

  Star({
    required this.x,
    required this.y,
    required this.size,
    required this.opacity,
  });
}