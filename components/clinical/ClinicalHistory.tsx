"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileText, User, Calendar, Activity, AlertCircle, Plus, Save, Edit2 } from "lucide-react";

interface MedicalRecord {
  id: string;
  date: string;
  therapistName: string;
  diagnosis: string;
  treatment: string;
  observations: string;
  nextSession?: string;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
}

const MOCK_PATIENT: PatientInfo = {
  id: "PAT-001",
  name: "Juan Pérez García",
  age: 35,
  gender: "Masculino",
  phone: "+1 234-567-8900",
  email: "juan.perez@email.com",
  bloodType: "O+",
  allergies: ["Penicilina"],
  medicalHistory: ["Cirugía de menisco (2023)", "Esguince de tobillo (2022)"]
};

const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: "REC-001",
    date: "2025-01-10",
    therapistName: "Dr. Carlos Méndez",
    diagnosis: "Esguince de rodilla grado II - Ligamento colateral medial",
    treatment: "Aplicación de electroterapia TENS, crioterapia y ejercicios isométricos de cuádriceps. Vendaje funcional.",
    observations: "Paciente presenta inflamación moderada. Rango de movimiento limitado a 90 grados. Dolor 6/10 en escala EVA.",
    nextSession: "2025-01-13"
  },
  {
    id: "REC-002",
    date: "2025-01-13",
    therapistName: "Dr. Carlos Méndez",
    diagnosis: "Seguimiento esguince LCM - Evolución favorable",
    treatment: "Ultrasonido terapéutico, movilizaciones pasivas y activas asistidas. Inicio de ejercicios de propiocepción.",
    observations: "Reducción significativa de inflamación. Mejora en rango de movimiento a 120 grados. Dolor 4/10. Paciente tolera bien el tratamiento.",
    nextSession: "2025-01-16"
  },
  {
    id: "REC-003",
    date: "2024-12-20",
    therapistName: "Dra. Ana Torres",
    diagnosis: "Contractura muscular paravertebral lumbar",
    treatment: "Terapia manual (masaje descontracturante), estiramientos miofasciales. Educación postural.",
    observations: "Tensión muscular bilateral. Dolor 7/10. Se recomienda continuar con ejercicios en casa.",
    nextSession: "2024-12-22"
  }
];

export function ClinicalHistory() {
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    treatment: "",
    observations: "",
    nextSession: ""
  });

  const handleAddRecord = () => {
    const record: MedicalRecord = {
      id: `REC-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      therapistName: "Dr. Current User", // En producción vendría del contexto
      ...newRecord
    };

    setRecords([record, ...records]);
    setIsAddingRecord(false);
    setNewRecord({ diagnosis: "", treatment: "", observations: "", nextSession: "" });
    alert("Registro clínico agregado exitosamente");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#a8dcd9] to-[#8bc9c5] rounded-2xl p-8 shadow-xl"
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
          <Button
            onClick={() => setIsAddingRecord(!isAddingRecord)}
            className="bg-white text-[#a8dcd9] hover:bg-gray-100 font-semibold py-6 px-8"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </motion.div>

      {/* Información del Paciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-7 h-7 text-[#a8dcd9]" />
          <h3 className="text-2xl font-bold text-gray-800">Información del Paciente</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#a8dcd9]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">ID Paciente</p>
            <p className="font-bold text-gray-800 text-lg">{MOCK_PATIENT.id}</p>
          </div>
          <div className="bg-[#a8dcd9]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
            <p className="font-bold text-gray-800 text-lg">{MOCK_PATIENT.name}</p>
          </div>
          <div className="bg-[#a8dcd9]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Edad / Género</p>
            <p className="font-bold text-gray-800 text-lg">{MOCK_PATIENT.age} años / {MOCK_PATIENT.gender}</p>
          </div>
          <div className="bg-[#a8dcd9]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Tipo de Sangre</p>
            <p className="font-bold text-gray-800 text-lg">{MOCK_PATIENT.bloodType}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="font-bold text-red-800">Alergias</p>
            </div>
            <ul className="list-disc list-inside text-red-700">
              {MOCK_PATIENT.allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <p className="font-bold text-blue-800">Antecedentes Médicos</p>
            </div>
            <ul className="list-disc list-inside text-blue-700">
              {MOCK_PATIENT.medicalHistory.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Formulario para Agregar Registro */}
      {isAddingRecord && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <Edit2 className="w-7 h-7 text-[#a8dcd9]" />
            <h3 className="text-2xl font-bold text-gray-800">Nuevo Registro Clínico</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnóstico
              </label>
              <input
                type="text"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                placeholder="Ingrese el diagnóstico del paciente..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tratamiento Aplicado
              </label>
              <textarea
                value={newRecord.treatment}
                onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                placeholder="Describa el tratamiento aplicado..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={newRecord.observations}
                onChange={(e) => setNewRecord({ ...newRecord, observations: e.target.value })}
                placeholder="Observaciones sobre la evolución del paciente..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Próxima Sesión (opcional)
              </label>
              <input
                type="date"
                value={newRecord.nextSession}
                onChange={(e) => setNewRecord({ ...newRecord, nextSession: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#a8dcd9] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddRecord}
                className="flex-1 bg-[#a8dcd9] hover:bg-[#8bc9c5] text-white font-semibold py-6"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#a8dcd9]/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-7 h-7 text-[#a8dcd9]" />
          <h3 className="text-2xl font-bold text-gray-800">Registros Médicos</h3>
        </div>

        <div className="space-y-6">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-[#a8dcd9]/30 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#a8dcd9] text-white px-4 py-1 rounded-lg font-bold text-sm">
                      {new Date(record.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <span className="text-gray-600">por {record.therapistName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-900 mb-1">DIAGNÓSTICO</p>
                  <p className="text-blue-800">{record.diagnosis}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm font-semibold text-green-900 mb-1">TRATAMIENTO</p>
                  <p className="text-green-800">{record.treatment}</p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
                  <p className="text-sm font-semibold text-amber-900 mb-1">OBSERVACIONES</p>
                  <p className="text-amber-800">{record.observations}</p>
                </div>

                {record.nextSession && (
                  <div className="bg-[#a8dcd9]/20 rounded-lg p-4 border-l-4 border-[#a8dcd9]">
                    <p className="text-sm font-semibold text-gray-900 mb-1">PRÓXIMA SESIÓN</p>
                    <p className="text-gray-800 font-bold">
                      {new Date(record.nextSession).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
