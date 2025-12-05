"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileText, User, Calendar, Activity, AlertCircle, Plus, Save, Edit2, Search, CheckCircle2, X, Stethoscope, ClipboardList, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MedicalRecord {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  fisioterapeuta: {
    id: number;
    especialidad: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface PatientInfo {
  id: number;
  codigo: string;
  fechaNacimiento: string;
  genero: string;
  tipoSangre: string;
  alergias?: string;
  antecedentes?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface Cita {
  id: number;
  paciente: {
    id: number;
    codigo: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export function ClinicalHistory() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fisioterapeutaId, setFisioterapeutaId] = useState<number | null>(null);
  const [misPacientes, setMisPacientes] = useState<Array<{ id: number; codigo: string; nombre: string }>>([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(null);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecord, setNewRecord] = useState({
    fechaRegistro: new Date().toISOString().split('T')[0],
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    proximaSesion: ""
  });

  useEffect(() => {
    loadFisioterapeuta();
  }, []);

  useEffect(() => {
    if (selectedPacienteId) {
      loadPatientData();
      loadRecords();
    }
  }, [selectedPacienteId]);

  const loadFisioterapeuta = async () => {
    try {
      setLoading(true);
      const fisio = await api.getFisioterapeutaActual();
      setFisioterapeutaId(fisio.id);

      // Cargar citas del fisioterapeuta para obtener sus pacientes
      const citas: Cita[] = await api.getCitasFisioterapeuta(fisio.id);

      // Extraer pacientes únicos
      const pacientesMap = new Map();
      citas.forEach(cita => {
        if (!pacientesMap.has(cita.paciente.id)) {
          pacientesMap.set(cita.paciente.id, {
            id: cita.paciente.id,
            codigo: cita.paciente.codigo,
            nombre: `${cita.paciente.user.firstName} ${cita.paciente.user.lastName}`
          });
        }
      });

      setMisPacientes(Array.from(pacientesMap.values()));
    } catch (err) {
      setError("Error al cargar información del fisioterapeuta");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientData = async () => {
    if (!selectedPacienteId) return;

    try {
      setLoading(true);
      setError("");
      const paciente = await api.getPaciente(selectedPacienteId);
      setPatientInfo(paciente);
    } catch (err) {
      setError("Error al cargar información del paciente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async () => {
    if (!selectedPacienteId) return;

    try {
      setLoading(true);
      setError("");
      const registros = await api.getRegistrosPaciente(selectedPacienteId);
      setRecords(registros);
    } catch (err) {
      setError("Error al cargar registros clínicos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!selectedPacienteId) return;

    // Validación
    if (!newRecord.diagnostico.trim()) {
      alert("El diagnóstico es requerido");
      return;
    }
    if (!newRecord.tratamiento.trim()) {
      alert("El tratamiento es requerido");
      return;
    }

    try {
      setLoading(true);
      await api.crearRegistroClinico({
        pacienteId: selectedPacienteId,
        fechaRegistro: newRecord.fechaRegistro,
        diagnostico: newRecord.diagnostico,
        tratamiento: newRecord.tratamiento,
        observaciones: newRecord.observaciones,
        proximaSesion: newRecord.proximaSesion || undefined
      });
      setIsAddingRecord(false);
      setNewRecord({
        fechaRegistro: new Date().toISOString().split('T')[0],
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
        proximaSesion: ""
      });
      alert("Registro clínico agregado exitosamente");
      await loadRecords();
    } catch (err: any) {
      alert(err?.message || "Error al agregar registro clínico");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (fechaNacimiento: string) => {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPacientes = misPacientes.filter(paciente =>
    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Historia Clínica</h2>
            </div>
            <p className="text-white/90 text-lg">
              Expediente médico completo del paciente
            </p>
          </div>
          {selectedPacienteId && (
            <Button
              onClick={() => setIsAddingRecord(!isAddingRecord)}
              disabled={loading}
              className="bg-white text-primary hover:bg-gray-100 font-semibold py-6 px-8 disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Registro
            </Button>
          )}
        </div>
      </motion.div>

      {/* Selector de Paciente con Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-7 h-7 text-primary" />
          <h3 className="text-2xl font-bold text-gray-800">Mis Pacientes</h3>
        </div>

        {loading && !selectedPacienteId ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando pacientes...</p>
          </div>
        ) : misPacientes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No hay pacientes asignados</p>
            <p className="text-gray-400 text-sm mt-2">Los pacientes con citas aparecerán aquí</p>
          </div>
        ) : (
          <>
            {/* Buscador */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o código..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {filteredPacientes.length} de {misPacientes.length} paciente(s)
              </p>
            </div>

            {/* Grid de Cards de Pacientes */}
            {filteredPacientes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron pacientes</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPacientes.map((paciente, index) => (
                  <motion.button
                    key={paciente.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPacienteId(paciente.id)}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${
                      selectedPacienteId === paciente.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-gray-200 bg-white hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedPacienteId === paciente.id
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-lg truncate">
                          {paciente.nombre}
                        </p>
                        <p className={`text-sm font-medium ${
                          selectedPacienteId === paciente.id
                            ? "text-primary"
                            : "text-gray-500"
                        }`}>
                          {paciente.codigo}
                        </p>
                        {selectedPacienteId === paciente.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 mt-2 text-primary text-xs font-semibold"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Seleccionado</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Información del Paciente - Rediseñado */}
      {patientInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-6 shadow-lg border-2 border-primary/30"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Ficha del Paciente</h3>
          </div>

          {/* Datos Principales - Grid Compacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Código</p>
              <p className="font-bold text-primary text-base">{patientInfo.codigo}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Edad</p>
              <p className="font-bold text-gray-800 text-base">
                {calculateAge(patientInfo.fechaNacimiento)} años
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Género</p>
              <p className="font-bold text-gray-800 text-base">{patientInfo.genero}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Tipo Sangre</p>
              <p className="font-bold text-gray-800 text-base">{patientInfo.tipoSangre}</p>
            </div>
          </div>

          {/* Nombre Completo */}
          <div className="bg-primary/10 rounded-lg p-3 border-2 border-primary/30 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Nombre Completo</p>
            <p className="font-bold text-gray-800 text-lg">
              {patientInfo.user.firstName} {patientInfo.user.lastName}
            </p>
          </div>

          {/* Información Médica Importante - Grid 2 Columnas */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Alergias */}
            <div className="bg-destructive/10 rounded-lg p-3 border-2 border-destructive/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="font-bold text-sm text-destructive">Alergias</p>
              </div>
              <p className="text-sm text-gray-700">
                {patientInfo.alergias || "Sin alergias registradas"}
              </p>
            </div>

            {/* Antecedentes */}
            <div className="bg-primary/10 rounded-lg p-3 border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <p className="font-bold text-sm text-primary">Antecedentes</p>
              </div>
              <p className="text-sm text-gray-700">
                {patientInfo.antecedentes || "Sin antecedentes registrados"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal para Agregar Registro Clínico - Diseño Optimizado */}
      <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Nuevo Registro Clínico</DialogTitle>
                <DialogDescription className="text-sm">
                  Complete la información médica del paciente
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Fila 1: Fechas */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-3 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <label className="text-sm font-semibold text-gray-800">
                    Fecha de Registro *
                  </label>
                </div>
                <input
                  type="date"
                  value={newRecord.fechaRegistro}
                  onChange={(e) => setNewRecord({ ...newRecord, fechaRegistro: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none transition-colors bg-white text-sm"
                />
              </div>

              <div className="bg-accent rounded-lg p-3 border-2 border-primary/15">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <label className="text-sm font-semibold text-gray-800">
                    Próxima Sesión
                  </label>
                </div>
                <input
                  type="date"
                  value={newRecord.proximaSesion}
                  onChange={(e) => setNewRecord({ ...newRecord, proximaSesion: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors bg-white text-sm"
                />
              </div>
            </div>

            {/* Fila 2: Diagnóstico y Tratamiento */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-lg p-3 border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <label className="text-sm font-semibold text-gray-800">
                    Diagnóstico Médico *
                  </label>
                </div>
                <textarea
                  value={newRecord.diagnostico}
                  onChange={(e) => setNewRecord({ ...newRecord, diagnostico: e.target.value })}
                  placeholder="Descripción del diagnóstico clínico..."
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/40 focus:border-primary focus:outline-none transition-colors h-32 bg-white resize-none text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ej: Lumbalgia aguda post-esfuerzo
                </p>
              </div>

              <div className="bg-primary/8 rounded-lg p-3 border-2 border-primary/25">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  <label className="text-sm font-semibold text-gray-800">
                    Tratamiento Aplicado *
                  </label>
                </div>
                <textarea
                  value={newRecord.tratamiento}
                  onChange={(e) => setNewRecord({ ...newRecord, tratamiento: e.target.value })}
                  placeholder="Técnicas, ejercicios y procedimientos..."
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary/35 focus:border-primary focus:outline-none transition-colors h-32 bg-white resize-none text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ej: TENS, masaje, ejercicios de estabilización
                </p>
              </div>
            </div>

            {/* Fila 3: Observaciones */}
            <div className="bg-muted rounded-lg p-3 border-2 border-border">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <label className="text-sm font-semibold text-gray-800">
                  Observaciones y Evolución
                </label>
              </div>
              <textarea
                value={newRecord.observaciones}
                onChange={(e) => setNewRecord({ ...newRecord, observaciones: e.target.value })}
                placeholder="Notas sobre progreso, reacciones o comentarios adicionales..."
                className="w-full px-3 py-2 rounded-lg border-2 border-input focus:border-primary focus:outline-none transition-colors h-24 bg-white resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional: evolución, adherencia al tratamiento, etc.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingRecord(false)}
              disabled={loading}
              className="px-5"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddRecord}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 px-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Registro
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registros Clínicos - Rediseñado */}
      {selectedPacienteId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-6 shadow-lg border-2 border-primary/30"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Historial de Registros Médicos</h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Cargando registros...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-destructive/10 rounded-xl border-2 border-destructive/20">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium">{error}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-xl border-2 border-dashed border-border">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium text-base">No hay registros clínicos</p>
              <p className="text-muted-foreground text-sm mt-2">Los registros aparecerán aquí una vez creados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border-2 border-primary/20 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Header del Registro */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b-2 border-primary/20">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-white px-3 py-1 rounded-md font-bold text-xs">
                          {new Date(record.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-700 font-medium">
                            Dr(a). {record.fisioterapeuta.user.firstName} {record.fisioterapeuta.user.lastName}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Registro #{record.id}
                      </span>
                    </div>
                  </div>

                  {/* Contenido del Registro */}
                  <div className="p-4 space-y-3">
                    {/* Diagnóstico */}
                    <div className="bg-primary/10 rounded-lg p-3 border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <p className="text-xs font-bold text-primary uppercase tracking-wide">Diagnóstico</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.diagnostico}</p>
                    </div>

                    {/* Tratamiento */}
                    <div className="bg-primary/8 rounded-lg p-3 border-l-4 border-primary/70">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="w-4 h-4 text-primary" />
                        <p className="text-xs font-bold text-primary uppercase tracking-wide">Tratamiento</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.tratamiento}</p>
                    </div>

                    {/* Observaciones */}
                    {record.observaciones && (
                      <div className="bg-muted rounded-lg p-3 border-l-4 border-muted-foreground/30">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Observaciones</p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{record.observaciones}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
