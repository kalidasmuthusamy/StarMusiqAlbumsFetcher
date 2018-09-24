const processExporterKey = 'processEnvExporter';

class ProcessEnvExporter {
  static export() {
    window[processExporterKey] = {};
    window[processExporterKey]['NODE_ENV'] = process.env.NODE_ENV;
    window[processExporterKey]['VAPID_PUBLIC_KEY'] = process.env.VAPID_PUBLIC_KEY;
    window[processExporterKey]['BACKEND_API_BASE_URL'] = process.env.BACKEND_API_BASE_URL;
  }
}

export default ProcessEnvExporter;
