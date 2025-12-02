"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileText, User, Calendar, Activity, AlertCircle, Plus, Save, Edit2, Search } from "lucide-react";
import { api } from "@/lib/api";

interface MedicalRecord {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  fisioterapeuta: {
    user: {
      firstName: string;
      lastName: string;
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
  const [newRecord, setNewRecord] = useState({
    diagnostico: "",
    tratamiento: "",
    observaciones: ""
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

    try {
      setLoading(true);
      await api.crearRegistroClinico({
        pacienteId: selectedPacienteId,
        ...newRecord
      });
      setIsAddingRecord(false);
      setNewRecord({ diagnostico: "", tratamiento: "", observaciones: "" });
      alert("Registro clínico agregado exitosamente");
      await loadRecords();
    } catch (err) {
      alert("Error al agregar registro clínico");
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

      {/* Selector de Paciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-800">Seleccionar Paciente</h3>
        </div>
        {loading && !selectedPacienteId ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Cargando pacientes...</p>
          </div>
        ) : misPacientes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay pacientes asignados</p>
        ) : (
          <select
            value={selectedPacienteId || ""}
            onChange={(e) => setSelectedPacienteId(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Selecciona un paciente...</option>
            {misPacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.codigo} - {paciente.nombre}
              </option>
            ))}
          </select>
        )}
      </motion.div>

      {/* Información del Paciente */}
      {patientInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-7 h-7 text-primary" />
            <h3 className="text-2xl font-bold text-gray-800">Información del Paciente</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Código Paciente</p>
              <p className="font-bold text-gray-800 text-lg">{patientInfo.codigo}</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
              <p className="font-bold text-gray-800 text-lg">
                {patientInfo.user.firstName} {patientInfo.user.lastName}
              </p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Edad / Género</p>
              <p className="font-bold text-gray-800 text-lg">
                {calculateAge(patientInfo.fechaNacimiento)} años / {patientInfo.genero}
              </p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Tipo de Sangre</p>
              <p className="font-bold text-gray-800 text-lg">{patientInfo.tipoSangre}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="font-bold text-red-800">Alergias</p>
              </div>
              <p className="text-red-700">
                {patientInfo.alergias || "No registradas"}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <p className="font-bold text-blue-800">Antecedentes Médicos</p>
              </div>
              <p className="text-blue-700">
                {patientInfo.antecedentes || "No registrados"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formulario para Agregar Registro */}
      {isAddingRecord && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary"
        >
          <div className="flex items-center gap-3 mb-6">
            <Edit2 className="w-7 h-7 text-primary" />
            <h3 className="text-2xl font-bold text-gray-800">Nuevo Registro Clínico</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnóstico
              </label>
              <input
                type="text"
                value={newRecord.diagnostico}
                onChange={(e) => setNewRecord({ ...newRecord, diagnostico: e.target.value })}
                placeholder="Ingrese el diagnóstico del paciente..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tratamiento Aplicado
              </label>
              <textarea
                value={newRecord.tratamiento}
                onChange={(e) => setNewRecord({ ...newRecord, tratamiento: e.target.value })}
                placeholder="Describa el tratamiento aplicado..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={newRecord.observaciones}
                onChange={(e) => setNewRecord({ ...newRecord, observaciones: e.target.value })}
                placeholder="Observaciones sobre la evolución del paciente..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors min-h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddRecord}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/80 text-white font-semibold py-6 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                Guardar Registro
              </Button>
              <Button
                onClick={() => setIsAddingRecord(false)}
                variant="outline"
                className="flex-1 py-6"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Registros Clínicos */}
      {selectedPacienteId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-primary/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-7 h-7 text-primary" />
            <h3 className="text-2xl font-bold text-gray-800">Registros Médicos</h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Cargando registros...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No hay registros clínicos para este paciente</p>
          ) : (
            <div className="space-y-6">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-primary/30 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary text-white px-4 py-1 rounded-lg font-bold text-sm">
                          {new Date(record.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <span className="text-gray-600">
                          por Dr(a). {record.fisioterapeuta.user.firstName} {record.fisioterapeuta.user.lastName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-blue-900 mb-1">DIAGNÓSTICO</p>
                      <p className="text-blue-800">{record.diagnostico}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-sm font-semibold text-green-900 mb-1">TRATAMIENTO</p>
                      <p className="text-green-800">{record.tratamiento}</p>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                      <p className="text-sm font-semibold text-amber-900 mb-1">OBSERVACIONES</p>
                      <p className="text-amber-800">{record.observaciones}</p>
                    </div>
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
