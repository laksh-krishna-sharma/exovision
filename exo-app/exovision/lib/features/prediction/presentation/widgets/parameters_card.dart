import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/prediction_provider.dart';
import 'parameter_input.dart';

class ParametersCard extends StatefulWidget {
  const ParametersCard({super.key});

  @override
  State<ParametersCard> createState() => _ParametersCardState();
}

class _ParametersCardState extends State<ParametersCard> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, TextEditingController> _controllers = {
    'period': TextEditingController(),
    'radius': TextEditingController(),
    'temperature': TextEditingController(),
    'mass': TextEditingController(),
  };

  @override
  void dispose() {
    _controllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

  void _runPrediction() {
    if (_formKey.currentState!.validate()) {
      final parameters = <String, double>{};
      _controllers.forEach((key, controller) {
        if (controller.text.isNotEmpty) {
          parameters[key] = double.tryParse(controller.text) ?? 0.0;
        }
      });

      if (parameters.isNotEmpty) {
        context.read<PredictionProvider>().makePrediction(parameters);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Input Parameters',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ParameterInput(
                label: 'Orbital Period (days)',
                controller: _controllers['period']!,
                hint: 'e.g., 365.25',
                icon: Icons.access_time,
              ),
              const SizedBox(height: 12),
              ParameterInput(
                label: 'Planet Radius (Earth radii)',
                controller: _controllers['radius']!,
                hint: 'e.g., 1.0',
                icon: Icons.circle_outlined,
              ),
              const SizedBox(height: 12),
              ParameterInput(
                label: 'Temperature (K)',
                controller: _controllers['temperature']!,
                hint: 'e.g., 288',
                icon: Icons.thermostat,
              ),
              const SizedBox(height: 12),
              ParameterInput(
                label: 'Planet Mass (Earth masses)',
                controller: _controllers['mass']!,
                hint: 'e.g., 1.0',
                icon: Icons.fitness_center,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: Consumer<PredictionProvider>(
                  builder: (context, provider, child) {
                    return ElevatedButton.icon(
                      onPressed: provider.isLoading ? null : _runPrediction,
                      icon: provider.isLoading
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.psychology),
                      label: Text(provider.isLoading ? 'Analyzing...' : 'Run AI Analysis'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}