import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../app/theme/colors.dart';

class GlowButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isEnabled;
  final bool isPrimary;
  final bool isMobile;
  final Color? backgroundColor;
  final Color? textColor;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final Widget? icon;

  const GlowButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isEnabled = true,
    this.isPrimary = true,
    this.isMobile = false,
    this.backgroundColor,
    this.textColor,
    this.width,
    this.height,
    this.padding,
    this.icon,
  });

  @override
  State<GlowButton> createState() => _GlowButtonState();
}

class _GlowButtonState extends State<GlowButton> {
  bool _isHovered = false;
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.isEnabled && !widget.isLoading;
    
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) => setState(() => _isPressed = false),
        onTapCancel: () => setState(() => _isPressed = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: widget.width,
          height: widget.height ?? (widget.isMobile ? 48 : 56),
          padding: widget.padding ?? EdgeInsets.symmetric(
            horizontal: widget.isMobile ? 20 : 24, 
            vertical: widget.isMobile ? 12 : 16
          ),
          decoration: BoxDecoration(
            gradient: isEnabled && widget.isPrimary
                ? LinearGradient(
                    colors: [
                      widget.backgroundColor ?? AppColors.cyan,
                      (widget.backgroundColor ?? AppColors.cyan).withOpacity(0.8),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  )
                : isEnabled && !widget.isPrimary
                ? null
                : LinearGradient(
                    colors: [
                      Colors.grey.withOpacity(0.3),
                      Colors.grey.withOpacity(0.2),
                    ],
                  ),
            color: !widget.isPrimary && isEnabled ? Colors.transparent : null,
            border: !widget.isPrimary && isEnabled 
                ? Border.all(color: AppColors.cyan.withOpacity(0.5), width: 1)
                : null,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isEnabled && (_isHovered || _isPressed) && widget.isPrimary
                ? [
                    BoxShadow(
                      color: (widget.backgroundColor ?? AppColors.cyan).withOpacity(0.4),
                      blurRadius: _isPressed ? 15 : 25,
                      spreadRadius: _isPressed ? 1 : 3,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: isEnabled ? widget.onPressed : null,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                alignment: Alignment.center,
                child: widget.isLoading
                    ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            widget.textColor ?? Colors.white,
                          ),
                        ),
                      )
                    : Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (widget.icon != null) ...[
                            widget.icon!,
                            const SizedBox(width: 8),
                          ],
                          Text(
                            widget.text,
                            style: TextStyle(
                              color: widget.textColor ?? Colors.white,
                              fontSize: widget.isMobile ? 14 : 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ),
      ),
    ).animate().fadeIn().scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1.0, 1.0),
    );
  }
}