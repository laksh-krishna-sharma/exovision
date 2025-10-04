import 'package:flutter/material.dart';
import '../../../app/theme/colors.dart';
import '../../../app/theme/text_styles.dart';

class GlowButton extends StatefulWidget {
  final VoidCallback onPressed;
  final String text;
  final bool isPrimary;
  final bool isMobile;
  final bool isLoading;

  const GlowButton({
    super.key,
    required this.onPressed,
    required this.text,
    required this.isPrimary,
    required this.isMobile,
    this.isLoading = false,
  });

  @override
  State<GlowButton> createState() => _GlowButtonState();
}

class _GlowButtonState extends State<GlowButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) => setState(() => _isPressed = false),
        onTapCancel: () => setState(() => _isPressed = false),
        onTap: widget.onPressed,
        child: Transform.scale(
          scale: _isPressed ? 0.95 : 1.0,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: EdgeInsets.symmetric(
              horizontal: widget.isMobile ? 24 : 32,
              vertical: widget.isMobile ? 14 : 16,
            ),
            decoration: BoxDecoration(
              gradient: widget.isPrimary
                  ? AppColors.buttonGradient
                  : null,
              color: widget.isPrimary
                  ? null
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: widget.isPrimary
                  ? null
                  : Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 1.5,
                    ),
              boxShadow: _isHovered && widget.isPrimary
                  ? [
                      BoxShadow(
                        color: AppColors.cyan.withOpacity(0.6),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.4),
                        blurRadius: 30,
                        spreadRadius: 5,
                      ),
                    ]
                  : widget.isPrimary
                      ? [
                          BoxShadow(
                            color: AppColors.cyan.withOpacity(0.3),
                            blurRadius: 10,
                            spreadRadius: 1,
                          ),
                        ]
                      : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget.isLoading) ...[
                  SizedBox(
                    width: widget.isMobile ? 14 : 16,
                    height: widget.isMobile ? 14 : 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(width: widget.isMobile ? 8 : 12),
                ],
                Text(
                  widget.text,
                  style: (widget.isMobile ? TextStyles.bodyLarge : TextStyles.titleMedium)
                      .copyWith(
                    color: widget.isPrimary
                        ? Colors.white
                        : Colors.white.withOpacity(0.9),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}