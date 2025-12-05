"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, FileText, Phone, MapPin, Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface Appointment {
  id: number;
  codigo: string;
  fecha: string;
  hora: string;
  estado: string;
  motivo?: string;
  ubicacion?: string;
  notas?: string;
  paciente: {
    id: number;
    codigo: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
}

export function FisioterapeutaAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "COMPLETADA" | "PROGRAMADA" | "CONFIRMADA" | "CANCELADA" | "INASISTENCIA">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const fisioterapeuta = await api.getFisioterapeutaActual();
      const citas = await api.getCitasFisioterapeuta(fisioterapeuta.id);
      setAppointments(citas || []);
    } catch (err: any) {
      console.error("Error al cargar citas:", err);
      setError("Error al cargar las citas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments
    .filter(apt => {
      const matchesFilter = filter === "all" || apt.estado === filter;
      const matchesSearch = searchQuery === "" || 
        apt.paciente.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.paciente.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.paciente.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.codigo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`);
      const dateB = new Date(`${b.fecha}T${b.hora}`);
      return dateB.getTime() - dateA.getTime();
    });

  const upcomingAppointments = appointments.filter(apt => 
    (apt.estado === "PROGRAMADA" || apt.estado === "CONFIRMADA") && 
    new Date(apt.fecha) >= new Date()
  );

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.fecha);
    return aptDate.toDateString() === today.toDateString();
  });

  // Agrupar citas por fecha para vista de calendario
  const appointmentsByDate = filteredAppointments.reduce((acc, apt) => {
    const date = apt.fecha;
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return <span className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded-full">Completada</span>;
      case "PROGRAMADA":
        return <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">Programada</span>;
      case "CONFIRMADA":
        return <span className="px-2.5 py-1 bg-primary/30 text-primary text-xs font-semibold rounded-full">Confirmada</span>;
      case "CANCELADA":
        return <span className="px-2.5 py-1 bg-destructive/20 text-destructive text-xs font-semibold rounded-full">Cancelada</span>;
      case "INASISTENCIA":
        return <span className="px-2.5 py-1 bg-destructive/30 text-destructive text-xs font-semibold rounded-full">Inasistencia</span>;
      default:
        return <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">{estado}</span>;
    }
  };

  const getFilterCount = (filterValue: string) => {
    if (filterValue === "all") return appointments.length;
    return appointments.filter(a => a.estado === filterValue).length;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-6 border-2 border-primary/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total de citas</p>
            <p className="text-2xl font-bold text-primary">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Hoy</p>
            <p className="text-2xl font-bold text-primary">{todayAppointments.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Próximas</p>
            <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Completadas</p>
            <p className="text-2xl font-bold text-primary">
              {appointments.filter(a => a.estado === "COMPLETADA").length}
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando citas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-xl border-2 border-destructive/20 p-8">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-semibold mb-2">{error}</p>
          <Button
            onClick={loadAppointments}
            variant="outline"
            className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            Reintentar
          </Button>
        </div>
      ) : appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-16 shadow-lg text-center border-2 border-dashed border-primary/30"
        >
          <Calendar className="w-24 h-24 text-primary/30 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No tienes citas asignadas</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            Las citas con tus pacientes aparecerán aquí una vez que sean programadas.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Barra de búsqueda y controles */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode("calendar")}
                variant={viewMode === "calendar" ? "default" : "outline"}
                className="gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Calendario
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "default" : "outline"}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Lista
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Todas" },
              { value: "PROGRAMADA", label: "Programadas" },
              { value: "CONFIRMADA", label: "Confirmadas" },
              { value: "COMPLETADA", label: "Completadas" },
              { value: "CANCELADA", label: "Canceladas" },
              { value: "INASISTENCIA", label: "Inasistencias" },
            ].map(filterOption => (
              <Button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                variant={filter === filterOption.value ? "default" : "outline"}
                size="sm"
                className="border-primary/30"
              >
                {filterOption.label} ({getFilterCount(filterOption.value)})
              </Button>
            ))}
          </div>

          {/* Vista de Calendario */}
          {viewMode === "calendar" && (
            <div className="space-y-6">
              {Object.keys(appointmentsByDate).length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-dashed border-primary/30"
                >
                  <Calendar className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No hay citas en esta categoría</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">Prueba con otro filtro o búsqueda</p>
                </motion.div>
              ) : (
                Object.entries(appointmentsByDate).map(([date, dayAppointments]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {/* Header del día */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border-l-4 border-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold text-gray-800 capitalize">
                            {formatDate(date)}
                          </h3>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {dayAppointments.length} {dayAppointments.length === 1 ? 'cita' : 'citas'}
                        </span>
                      </div>
                    </div>

                    {/* Citas del día */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {dayAppointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl p-4 border-2 border-primary/20 hover:border-primary/40 hover:shadow-md transition-all"
                        >
                          {/* Header con paciente y estado */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.paciente.user.firstName} {appointment.paciente.user.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">{appointment.paciente.codigo}</p>
                              </div>
                            </div>
                            {getStatusBadge(appointment.estado)}
                          </div>

                          {/* Información en grid */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="font-medium">{appointment.hora}</span>
                              <span className="text-xs">• {appointment.codigo}</span>
                            </div>

                            {appointment.paciente.user.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>{appointment.paciente.user.phone}</span>
                              </div>
                            )}

                            {appointment.ubicacion && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>{appointment.ubicacion}</span>
                              </div>
                            )}
                          </div>

                          {/* Motivo */}
                          {appointment.motivo && (
                            <div className="mt-3 bg-primary/5 rounded-lg p-3">
                              <p className="text-xs font-semibold text-primary mb-1">Motivo:</p>
                              <p className="text-sm text-gray-700">{appointment.motivo}</p>
                            </div>
                          )}

                          {/* Notas */}
                          {appointment.notas && (
                            <div className="mt-2 bg-accent rounded-lg p-3 border-l-2 border-primary">
                              <p className="text-xs font-semibold text-primary mb-1">Notas:</p>
                              <p className="text-sm text-gray-700">{appointment.notas}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Vista de Lista */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {filteredAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-dashed border-primary/30"
                >
                  <Calendar className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No hay citas en esta categoría</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">Prueba con otro filtro o búsqueda</p>
                </motion.div>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-xl p-5 border-2 border-primary/20 hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Columna izquierda: Información principal */}
                      <div className="flex-1 space-y-3">
                        {/* Paciente */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {appointment.paciente.user.firstName} {appointment.paciente.user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.paciente.codigo} • {appointment.codigo}
                            </p>
                          </div>
                        </div>

                        {/* Grid de información */}
                        <div className="grid md:grid-cols-2 gap-3 ml-13">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{formatDate(appointment.fecha)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">{appointment.hora}</span>
                          </div>
                          {appointment.paciente.user.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{appointment.paciente.user.phone}</span>
                            </div>
                          )}
                          {appointment.ubicacion && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="text-muted-foreground">{appointment.ubicacion}</span>
                            </div>
                          )}
                        </div>

                        {/* Motivo */}
                        {appointment.motivo && (
                          <div className="ml-13 bg-primary/5 rounded-lg p-3">
                            <p className="text-xs font-semibold text-primary mb-1">Motivo de consulta:</p>
                            <p className="text-sm text-gray-700">{appointment.motivo}</p>
                          </div>
                        )}

                        {/* Notas */}
                        {appointment.notas && (
                          <div className="ml-13 bg-accent rounded-lg p-3 border-l-2 border-primary">
                            <p className="text-xs font-semibold text-primary mb-1">Notas:</p>
                            <p className="text-sm text-gray-700">{appointment.notas}</p>
                          </div>
                        )}
                      </div>

                      {/* Columna derecha: Estado */}
                      <div className="flex lg:flex-col items-center lg:items-end gap-2">
                        {getStatusBadge(appointment.estado)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
