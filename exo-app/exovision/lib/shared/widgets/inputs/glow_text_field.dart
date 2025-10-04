import 'package:flutter/material.dart';
import '../../../app/theme/colors.dart';
import '../../../app/theme/text_styles.dart';

class GlowTextField extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final bool obscureText;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final bool isMobile;

  const GlowTextField({
    super.key,
    required this.controller,
    required this.labelText,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    required this.isMobile,
  });

  @override
  State<GlowTextField> createState() => _GlowTextFieldState();
}

class _GlowTextFieldState extends State<GlowTextField> {
  bool _isFocused = false;
  bool _hasError = false;

  @override
  Widget build(BuildContext context) {
    return Focus(
      onFocusChange: (focused) {
        setState(() => _isFocused = focused);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
        child: TextFormField(
          controller: widget.controller,
          obscureText: widget.obscureText,
          keyboardType: widget.keyboardType,
          validator: (value) {
            final error = widget.validator?.call(value);
            setState(() => _hasError = error != null);
            return error;
          },
          style: (widget.isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
              .copyWith(color: Colors.white),
          decoration: InputDecoration(
            labelText: widget.labelText,
            labelStyle: (widget.isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                .copyWith(
              color: _hasError
                  ? AppColors.error
                  : (_isFocused ? AppColors.cyan : Colors.white.withOpacity(0.6)),
            ),
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _hasError
                    ? AppColors.error.withOpacity(0.5)
                    : Colors.white.withOpacity(0.2),
                width: 1.5,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: _hasError ? AppColors.error : AppColors.cyan,
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppColors.error.withOpacity(0.8),
                width: 1.5,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppColors.error,
                width: 2,
              ),
            ),
            contentPadding: EdgeInsets.all(widget.isMobile ? 16 : 20),
            errorStyle: (widget.isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                .copyWith(color: AppColors.error),
          ),
        ),
      ),
    );
  }
}