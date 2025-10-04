import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SpaceBackground extends StatefulWidget {
  final double? starDensity;
  final bool animateStars;

  const SpaceBackground({
    super.key,
    this.starDensity = 1.0,
    this.animateStars = true,
  });

  @override
  State<SpaceBackground> createState() => _SpaceBackgroundState();
}

class _SpaceBackgroundState extends State<SpaceBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<Star> _stars = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 50),
    )..repeat();

    _generateStars();
  }

  void _generateStars() {
    final int starCount = (300 * widget.starDensity!).toInt();
    
    for (int i = 0; i < starCount; i++) {
      _stars.add(Star(
        x: _random.nextDouble(),
        y: _random.nextDouble(),
        size: _random.nextDouble() * 2 + 0.5,
        speed: _random.nextDouble() * 0.8 + 0.2,
        opacity: _random.nextDouble() * 0.7 + 0.3,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: CustomPaint(
        painter: _SpaceBackgroundPainter(
          stars: _stars,
          animation: _controller,
          animateStars: widget.animateStars,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

class Star {
  final double x;
  final double y;
  final double size;
  final double speed;
  final double opacity;

  Star({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
  });
}

class _SpaceBackgroundPainter extends CustomPainter {
  final List<Star> stars;
  final Animation<double> animation;
  final bool animateStars;
  final Random _random = Random();
  final Rect _rect = Rect.fromLTWH(0, 0, 1000, 1000);

  _SpaceBackgroundPainter({
    required this.stars,
    required this.animation,
    required this.animateStars,
  }) : super(repaint: animation);

  @override
  void paint(Canvas canvas, Size size) {
    // Draw space gradient background
    final gradient = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        const Color(0xFF0A0E17),
        const Color(0xFF1A1F2E),
        const Color(0xFF2A2F3D),
      ],
    );

    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final paint = Paint()
      ..shader = gradient.createShader(rect)
      ..style = PaintingStyle.fill;

    canvas.drawRect(rect, paint);

    // Draw stars
    final starPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    for (final star in stars) {
      final currentOpacity = animateStars
          ? star.opacity * (0.7 + 0.3 * sin(animation.value * 2 * pi * star.speed))
          : star.opacity;

      starPaint.color = Colors.white.withOpacity(currentOpacity);

      final x = star.x * size.width;
      final y = star.y * size.height;
      final radius = star.size;

      canvas.drawCircle(Offset(x, y), radius, starPaint);

      // Draw twinkle effect for some stars
      if (animateStars && _random.nextDouble() < 0.1) {
        final twinkleRadius = radius * (1.2 + 0.3 * sin(animation.value * 4 * pi));
        canvas.drawCircle(
          Offset(x, y),
          twinkleRadius,
          starPaint..color = Colors.white.withOpacity(currentOpacity * 0.5),
        );
      }
    }

    // Draw some nebula effects
    _drawNebula(canvas, size);
  }

  void _drawNebula(Canvas canvas, Size size) {
    // Purple nebula
    final purpleGradient = RadialGradient(
      colors: [
        const Color(0xFF9D4EDD).withOpacity(0.1),
        const Color(0xFF9D4EDD).withOpacity(0.05),
        Colors.transparent,
      ],
    );

    canvas.saveLayer(_rect, Paint());
    canvas.translate(size.width * 0.7, size.height * 0.3);
    canvas.drawCircle(
      Offset.zero,
      size.width * 0.4,
      Paint()..shader = purpleGradient.createShader(
        Rect.fromCircle(center: Offset.zero, radius: size.width * 0.4),
      ),
    );
    canvas.restore();

    // Blue nebula
    final blueGradient = RadialGradient(
      colors: [
        const Color(0xFF00D4FF).withOpacity(0.08),
        const Color(0xFF00D4FF).withOpacity(0.03),
        Colors.transparent,
      ],
    );

    canvas.saveLayer(_rect, Paint());
    canvas.translate(size.width * 0.2, size.height * 0.7);
    canvas.drawCircle(
      Offset.zero,
      size.width * 0.3,
      Paint()..shader = blueGradient.createShader(
        Rect.fromCircle(center: Offset.zero, radius: size.width * 0.3),
      ),
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}