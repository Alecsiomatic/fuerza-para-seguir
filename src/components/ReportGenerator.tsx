import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, Download, Loader2 } from "lucide-react";

const API_URL = "https://fuerzaparaseguir.com/api/analytics";

interface ReportData {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    callClicks: number;
    conversionRate: number;
    avgTimeOnPage: number;
    newVisitors: number;
    returningVisitors: number;
  };
  deviceBreakdown: Array<{ device_type: string; count: number; percentage: string }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: string }>;
  osBreakdown: Array<{ os: string; count: number; percentage: string }>;
  trafficSources: Array<{ source: string; count: number }>;
  visitsByDate: Array<{ date: string; visits: number; unique_visitors: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
  utmSources: Array<{ utm_source: string; count: number }>;
  languages: Array<{ language: string; count: number }>;
  screenResolutions: Array<{ resolution: string; count: number }>;
}

interface ReportGeneratorProps {
  branch: string;
  branchName: string;
}

const branchColors: Record<string, { primary: number[]; secondary: number[]; accent: number[] }> = {
  "tierra-blanca": { primary: [59, 130, 246], secondary: [37, 99, 235], accent: [147, 197, 253] },
  "corregidora": { primary: [34, 197, 94], secondary: [22, 163, 74], accent: [134, 239, 172] },
  "valles": { primary: [168, 85, 247], secondary: [147, 51, 234], accent: [216, 180, 254] },
  "home": { primary: [249, 115, 22], secondary: [234, 88, 12], accent: [253, 186, 116] },
  "todas": { primary: [99, 102, 241], secondary: [79, 70, 229], accent: [165, 180, 252] },
};

const branchPhones: Record<string, string> = {
  "tierra-blanca": "442 741 6163",
  "corregidora": "442 229 1372",
  "valles": "481 113 5768",
  "todas": "Múltiples sucursales",
};

export function ReportGenerator({ branch, branchName }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchReportData = async (): Promise<ReportData | null> => {
    if (!startDate || !endDate) return null;

    try {
      const start = format(startDate, "yyyy-MM-dd");
      const end = format(endDate, "yyyy-MM-dd");
      
      const response = await fetch(
        `${API_URL}/report/${branch}?startDate=${start}&endDate=${end}`
      );
      
      if (!response.ok) throw new Error("Error fetching report data");
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return null;
    }
  };

  // Función para dibujar una barra horizontal
  const drawHorizontalBar = (doc: jsPDF, x: number, y: number, width: number, height: number, percentage: number, color: number[]) => {
    // Fondo gris
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(x, y, width, height, 2, 2, "F");
    // Barra de color
    const barWidth = (percentage / 100) * width;
    if (barWidth > 0) {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(x, y, Math.max(barWidth, 4), height, 2, 2, "F");
    }
  };

  // Función para agregar header a cada página
  const addPageHeader = (doc: jsPDF, colors: any, branchName: string, periodText: string, pageNum: number) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 22, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Reporte Analytics - ${branchName}`, 15, 14);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(periodText, pageWidth - 15, 14, { align: "right" });
    
    doc.setFontSize(8);
    doc.text(`Pág. ${pageNum}`, pageWidth / 2, 14, { align: "center" });
  };

  // Función para agregar footer
  const addPageFooter = (doc: jsPDF) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text("Fuerza Para Seguir - Centro de Rehabilitación | fuerzaparaseguir.com", pageWidth / 2, pageHeight - 7, { align: "center" });
  };

  const generatePDF = async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);

    try {
      const data = await fetchReportData();
      if (!data) {
        alert("Error al obtener los datos del reporte");
        setIsLoading(false);
        return;
      }

      const doc = new jsPDF();
      const colors = branchColors[branch] || branchColors["todas"];
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const daysDiff = differenceInDays(endDate, startDate) + 1;
      const periodText = `${format(startDate, "d MMM yyyy", { locale: es })} - ${format(endDate, "d MMM yyyy", { locale: es })}`;

      // ═══════════════════════════════════════════════════════════════
      // PÁGINA 1: PORTADA
      // ═══════════════════════════════════════════════════════════════
      
      // Fondo decorativo superior
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, pageWidth, 100, "F");
      
      // Degradado simulado
      doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.triangle(0, 100, pageWidth, 70, pageWidth, 100, "F");

      // Logo texto
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.text("FUERZA PARA SEGUIR", pageWidth / 2, 40, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Centro de Rehabilitación y Tratamiento de Adicciones", pageWidth / 2, 52, { align: "center" });

      // Línea decorativa
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.line(60, 60, pageWidth - 60, 60);

      // Sucursal
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(branchName.toUpperCase(), pageWidth / 2, 75, { align: "center" });

      if (branch !== "todas") {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Tel: ${branchPhones[branch] || ""}`, pageWidth / 2, 85, { align: "center" });
      }

      // Título del reporte
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("REPORTE DE ANALYTICS", pageWidth / 2, 125, { align: "center" });

      // Período
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Período: ${format(startDate, "d 'de' MMMM yyyy", { locale: es })}`, pageWidth / 2, 140, { align: "center" });
      doc.text(`al ${format(endDate, "d 'de' MMMM yyyy", { locale: es })}`, pageWidth / 2, 150, { align: "center" });
      
      doc.setFontSize(11);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(`(${daysDiff} días de análisis)`, pageWidth / 2, 162, { align: "center" });

      // ═══ RESUMEN EJECUTIVO ═══
      let yPos = 180;
      
      // Caja de resumen
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, yPos - 5, pageWidth - 30, 85, 5, 5, "F");
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.roundedRect(15, yPos - 5, pageWidth - 30, 85, 5, 5, "S");

      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RESUMEN EJECUTIVO", pageWidth / 2, yPos + 8, { align: "center" });

      // Grid de métricas principales (2x3)
      const metrics = [
        { label: "Total Visitas", value: data.summary.totalVisits.toLocaleString() },
        { label: "Visitantes Únicos", value: data.summary.uniqueVisitors.toLocaleString() },
        { label: "Clics en Llamada", value: data.summary.callClicks.toLocaleString() },
        { label: "Tasa Conversión", value: `${data.summary.conversionRate.toFixed(2)}%` },
        { label: "Promedio Diario", value: Math.round(data.summary.totalVisits / daysDiff).toLocaleString() },
        { label: "Visitantes Nuevos", value: data.summary.newVisitors.toLocaleString() },
      ];

      const colWidth = (pageWidth - 50) / 3;
      yPos += 25;

      metrics.forEach((metric, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 25 + (col * colWidth);
        const y = yPos + (row * 28);

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(metric.value, x + colWidth / 2, y, { align: "center" });

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(metric.label, x + colWidth / 2, y + 10, { align: "center" });
      });

      // Fecha de generación
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Reporte generado el ${format(new Date(), "EEEE d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}`,
        pageWidth / 2,
        pageHeight - 15,
        { align: "center" }
      );

      // ═══════════════════════════════════════════════════════════════
      // PÁGINA 2: ANÁLISIS DE TRÁFICO
      // ═══════════════════════════════════════════════════════════════
      doc.addPage();
      addPageHeader(doc, colors, branchName, periodText, 2);

      yPos = 35;

      // Título de sección
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ANÁLISIS DE FUENTES DE TRÁFICO", pageWidth / 2, yPos + 7, { align: "center" });

      yPos += 20;

      // Fuentes de tráfico con barras visuales
      if (data.trafficSources && data.trafficSources.length > 0) {
        const totalTraffic = data.trafficSources.reduce((sum, s) => sum + s.count, 0);

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Distribución por Fuente de Tráfico", 15, yPos);
        yPos += 8;

        data.trafficSources.slice(0, 6).forEach((source) => {
          const percentage = (source.count / totalTraffic) * 100;
          
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(source.source || "Desconocido", 15, yPos + 5);
          
          drawHorizontalBar(doc, 60, yPos, 80, 6, percentage, colors.primary);
          
          doc.setFont("helvetica", "bold");
          doc.text(`${source.count.toLocaleString()} (${percentage.toFixed(1)}%)`, 145, yPos + 5);
          
          yPos += 12;
        });
      }

      yPos += 10;

      // Campañas UTM
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(15, yPos, pageWidth - 30, 8, 2, 2, "F");
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Campañas UTM Detectadas", 20, yPos + 6);
      yPos += 15;

      if (data.utmSources && data.utmSources.length > 0) {
        const utmData = data.utmSources.slice(0, 8).map((utm) => [
          utm.utm_source || "Sin fuente",
          utm.count.toLocaleString(),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Fuente UTM", "Visitas"]],
          body: utmData,
          theme: "striped",
          headStyles: {
            fillColor: [colors.secondary[0], colors.secondary[1], colors.secondary[2]],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 15, right: pageWidth / 2 + 10 },
          tableWidth: pageWidth / 2 - 25,
        });
      } else {
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(9);
        doc.text("No se detectaron parámetros UTM en este período", 20, yPos + 5);
      }

      // Resumen de adquisición (lado derecho)
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(pageWidth / 2 + 5, yPos - 15, pageWidth / 2 - 20, 8, 2, 2, "F");
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Resumen de Adquisición", pageWidth / 2 + 10, yPos - 9);

      const acquisitionY = yPos;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      const facebookVisits = data.trafficSources.find(s => s.source === "Facebook")?.count || 0;
      const directVisits = data.trafficSources.find(s => s.source === "Directo")?.count || 0;
      const googleVisits = data.trafficSources.find(s => s.source === "Google")?.count || 0;
      const otherVisits = data.trafficSources.find(s => s.source === "Otro")?.count || 0;

      const acquisitionData = [
        { label: "Redes Sociales", value: facebookVisits, color: [66, 103, 178] },
        { label: "Tráfico Directo", value: directVisits, color: [52, 168, 83] },
        { label: "Buscadores", value: googleVisits, color: [234, 67, 53] },
        { label: "Otros", value: otherVisits, color: [150, 150, 150] },
      ];

      acquisitionData.forEach((item, index) => {
        const y = acquisitionY + (index * 15);
        doc.setFillColor(item.color[0], item.color[1], item.color[2]);
        doc.circle(pageWidth / 2 + 12, y + 2, 3, "F");
        doc.setTextColor(60, 60, 60);
        doc.text(item.label, pageWidth / 2 + 18, y + 4);
        doc.setFont("helvetica", "bold");
        doc.text(item.value.toLocaleString(), pageWidth - 20, y + 4, { align: "right" });
        doc.setFont("helvetica", "normal");
      });

      addPageFooter(doc);

      // ═══════════════════════════════════════════════════════════════
      // PÁGINA 3: DISPOSITIVOS Y TECNOLOGÍA
      // ═══════════════════════════════════════════════════════════════
      doc.addPage();
      addPageHeader(doc, colors, branchName, periodText, 3);

      yPos = 35;

      // Título
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ANÁLISIS DE DISPOSITIVOS Y TECNOLOGÍA", pageWidth / 2, yPos + 7, { align: "center" });

      yPos += 20;

      // ═══ DISPOSITIVOS ═══
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Tipo de Dispositivo", 15, yPos);
      yPos += 8;

      if (data.deviceBreakdown && data.deviceBreakdown.length > 0) {
        data.deviceBreakdown.slice(0, 4).forEach((device) => {
          const percentage = parseFloat(device.percentage) || 0;
          const deviceName = device.device_type === "mobile" ? "Móvil" :
                            device.device_type === "desktop" ? "Escritorio" :
                            device.device_type === "tablet" ? "Tablet" : (device.device_type || "Desconocido");

          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(deviceName, 15, yPos + 4);

          drawHorizontalBar(doc, 50, yPos, 40, 5, percentage, colors.primary);

          doc.setFont("helvetica", "bold");
          doc.text(`${device.count.toLocaleString()} (${percentage.toFixed(1)}%)`, 95, yPos + 4);

          yPos += 10;
        });
      }

      // ═══ NAVEGADORES ═══
      yPos += 8;
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Navegadores Web", 15, yPos);
      yPos += 8;

      if (data.browserBreakdown && data.browserBreakdown.length > 0) {
        data.browserBreakdown.slice(0, 5).forEach((browser) => {
          const percentage = parseFloat(browser.percentage) || 0;

          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(browser.browser || "Desconocido", 15, yPos + 4);

          drawHorizontalBar(doc, 55, yPos, 35, 5, percentage, colors.secondary);

          doc.setFont("helvetica", "bold");
          doc.text(`${browser.count.toLocaleString()} (${percentage.toFixed(1)}%)`, 95, yPos + 4);

          yPos += 10;
        });
      }

      // ═══ SISTEMAS OPERATIVOS (lado derecho) ═══
      let rightYPos = 63;
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Sistemas Operativos", pageWidth / 2 + 10, rightYPos);
      rightYPos += 8;

      if (data.osBreakdown && data.osBreakdown.length > 0) {
        data.osBreakdown.slice(0, 6).forEach((os) => {
          const percentage = parseFloat(os.percentage) || 0;

          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(os.os || "Desconocido", pageWidth / 2 + 10, rightYPos + 4);

          drawHorizontalBar(doc, pageWidth / 2 + 50, rightYPos, 30, 5, percentage, colors.primary);

          doc.setFont("helvetica", "bold");
          doc.text(`${percentage.toFixed(1)}%`, pageWidth - 15, rightYPos + 4, { align: "right" });

          rightYPos += 10;
        });
      }

      // ═══ IDIOMAS ═══
      rightYPos += 10;
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Idiomas", pageWidth / 2 + 10, rightYPos);
      rightYPos += 8;

      if (data.languages && data.languages.length > 0) {
        data.languages.slice(0, 5).forEach((lang) => {
          const langName = lang.language === "es-MX" ? "Español (México)" :
                          lang.language === "es" ? "Español" :
                          lang.language === "en" ? "English" :
                          lang.language === "en-US" ? "English (US)" : (lang.language || "Desconocido");

          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(langName, pageWidth / 2 + 10, rightYPos + 4);
          doc.setFont("helvetica", "bold");
          doc.text(lang.count.toLocaleString(), pageWidth - 15, rightYPos + 4, { align: "right" });

          rightYPos += 10;
        });
      }

      // ═══ RESOLUCIONES DE PANTALLA ═══
      yPos = Math.max(yPos, rightYPos) + 15;

      doc.setFillColor(245, 247, 250);
      doc.roundedRect(15, yPos, pageWidth - 30, 8, 2, 2, "F");
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Resoluciones de Pantalla Más Comunes", 20, yPos + 6);
      yPos += 15;

      if (data.screenResolutions && data.screenResolutions.length > 0) {
        const resData = data.screenResolutions.slice(0, 8).map((res, i) => [
          `${i + 1}`,
          res.resolution || "Desconocido",
          res.count.toLocaleString(),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["#", "Resolución", "Usuarios"]],
          body: resData,
          theme: "grid",
          headStyles: {
            fillColor: [colors.secondary[0], colors.secondary[1], colors.secondary[2]],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 15, halign: "center" },
            1: { cellWidth: 50 },
            2: { cellWidth: 30, halign: "right" },
          },
          margin: { left: 15, right: pageWidth / 2 + 10 },
        });
      }

      addPageFooter(doc);

      // ═══════════════════════════════════════════════════════════════
      // PÁGINA 4: TENDENCIAS DIARIAS
      // ═══════════════════════════════════════════════════════════════
      doc.addPage();
      addPageHeader(doc, colors, branchName, periodText, 4);

      yPos = 35;

      // Título
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("TENDENCIAS Y VISITAS DIARIAS", pageWidth / 2, yPos + 7, { align: "center" });

      yPos += 20;

      // Gráfico de barras simplificado
      if (data.visitsByDate && data.visitsByDate.length > 0) {
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Gráfico de Visitas por Día", 15, yPos);
        yPos += 10;

        const maxVisits = Math.max(...data.visitsByDate.map(d => d.visits));
        const chartWidth = pageWidth - 40;
        const chartHeight = 50;
        const barWidth = Math.min(chartWidth / data.visitsByDate.length - 2, 15);

        // Fondo del gráfico
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(15, yPos, chartWidth + 10, chartHeight + 15, 3, 3, "F");

        // Líneas de guía
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        for (let i = 0; i <= 4; i++) {
          const lineY = yPos + 5 + (chartHeight - (chartHeight * (i / 4)));
          doc.line(20, lineY, 15 + chartWidth, lineY);
        }

        // Barras
        data.visitsByDate.slice(-Math.min(data.visitsByDate.length, 20)).forEach((day, index) => {
          const barHeight = maxVisits > 0 ? (day.visits / maxVisits) * (chartHeight - 5) : 0;
          const x = 20 + (index * (barWidth + 2));
          const y = yPos + chartHeight - barHeight + 5;

          doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          if (barHeight > 0) {
            doc.roundedRect(x, y, barWidth, barHeight, 1, 1, "F");
          }
        });

        yPos += chartHeight + 25;

        // Tabla de datos detallada
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Detalle de Visitas por Día", 15, yPos);
        yPos += 8;

        const visitsData = data.visitsByDate.map((day) => {
          const dayDate = parseISO(day.date);
          return [
            format(dayDate, "EEE", { locale: es }),
            format(dayDate, "d MMM", { locale: es }),
            day.visits.toLocaleString(),
            day.unique_visitors.toLocaleString(),
            `${((day.unique_visitors / day.visits) * 100).toFixed(1)}%`,
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [["Día", "Fecha", "Visitas", "Únicos", "% Únicos"]],
          body: visitsData,
          theme: "striped",
          headStyles: {
            fillColor: [colors.primary[0], colors.primary[1], colors.primary[2]],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25, halign: "right" },
            3: { cellWidth: 25, halign: "right" },
            4: { cellWidth: 25, halign: "right" },
          },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: 15, right: 15 },
        });

        // Totales
        const totalVisits = data.visitsByDate.reduce((sum, d) => sum + d.visits, 0);
        const totalUnique = data.visitsByDate.reduce((sum, d) => sum + d.unique_visitors, 0);
        
        yPos = (doc as any).lastAutoTable.finalY + 5;
        
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, "F");
        
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TOTALES:", 25, yPos + 8);
        doc.text(`${totalVisits.toLocaleString()} visitas`, 80, yPos + 8);
        doc.text(`${totalUnique.toLocaleString()} únicos`, 130, yPos + 8);
        doc.text(`${((totalUnique / totalVisits) * 100).toFixed(1)}% únicos`, pageWidth - 25, yPos + 8, { align: "right" });
      }

      addPageFooter(doc);

      // ═══════════════════════════════════════════════════════════════
      // PÁGINA 5: CONVERSIONES Y CONCLUSIONES
      // ═══════════════════════════════════════════════════════════════
      doc.addPage();
      addPageHeader(doc, colors, branchName, periodText, 5);

      yPos = 35;

      // Título
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CONVERSIONES Y ANÁLISIS DE RENDIMIENTO", pageWidth / 2, yPos + 7, { align: "center" });

      yPos += 20;

      // Métricas de conversión
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Análisis de Conversiones (Clics en Llamada)", 15, yPos);
      yPos += 10;

      // Caja de conversión
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.roundedRect(15, yPos, 85, 40, 5, 5, "F");

      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(data.summary.callClicks.toLocaleString(), 57, yPos + 22, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Clics en Llamada", 57, yPos + 34, { align: "center" });

      // Tasa de conversión
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(110, yPos, 85, 40, 5, 5, "F");
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(110, yPos, 85, 40, 5, 5, "S");

      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(`${data.summary.conversionRate.toFixed(2)}%`, 152, yPos + 22, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Tasa de Conversión", 152, yPos + 34, { align: "center" });

      yPos += 55;

      // Clics por día
      if (data.clicksByDate && data.clicksByDate.length > 0) {
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Detalle de Clics por Día:", 15, yPos);
        yPos += 8;

        const clicksData = data.clicksByDate.map((day) => [
          format(parseISO(day.date), "EEEE d 'de' MMMM", { locale: es }),
          day.clicks.toLocaleString(),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Fecha", "Clics"]],
          body: clicksData,
          theme: "striped",
          headStyles: {
            fillColor: [colors.secondary[0], colors.secondary[1], colors.secondary[2]],
            textColor: [255, 255, 255],
            fontSize: 9,
          },
          bodyStyles: { fontSize: 9 },
          margin: { left: 15, right: pageWidth / 2 + 10 },
          tableWidth: pageWidth / 2 - 25,
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
      } else {
        yPos += 10;
      }

      // ═══ CONCLUSIONES ═══
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(15, yPos, pageWidth - 30, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CONCLUSIONES Y RECOMENDACIONES", pageWidth / 2, yPos + 7, { align: "center" });

      yPos += 18;

      // Caja de conclusiones
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, yPos, pageWidth - 30, 70, 5, 5, "F");

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const bestDay = data.visitsByDate?.reduce((best, day) => day.visits > best.visits ? day : best, data.visitsByDate[0]);
      const worstDay = data.visitsByDate?.reduce((worst, day) => day.visits < worst.visits ? day : worst, data.visitsByDate[0]);
      const topSource = data.trafficSources?.[0];
      const topDevice = data.deviceBreakdown?.[0];

      const conclusions = [
        `• Se registraron ${data.summary.totalVisits.toLocaleString()} visitas totales en ${daysDiff} días.`,
        `• Promedio diario de ${Math.round(data.summary.totalVisits / daysDiff).toLocaleString()} visitas.`,
        `• ${data.summary.uniqueVisitors.toLocaleString()} visitantes únicos (${((data.summary.uniqueVisitors / data.summary.totalVisits) * 100).toFixed(1)}% del total).`,
        `• Principal fuente de tráfico: ${topSource?.source || "N/A"} (${topSource?.count?.toLocaleString() || 0} visitas).`,
        `• Dispositivo predominante: ${topDevice?.device_type || "N/A"}.`,
        bestDay ? `• Mejor día: ${format(parseISO(bestDay.date), "d 'de' MMMM", { locale: es })} con ${bestDay.visits.toLocaleString()} visitas.` : "",
        worstDay ? `• Día con menos tráfico: ${format(parseISO(worstDay.date), "d 'de' MMMM", { locale: es })} con ${worstDay.visits.toLocaleString()} visitas.` : "",
        `• ${data.summary.callClicks} conversiones con una tasa del ${data.summary.conversionRate.toFixed(2)}%.`,
      ].filter(Boolean);

      conclusions.forEach((line, index) => {
        doc.text(line, 22, yPos + 10 + (index * 8));
      });

      addPageFooter(doc);

      // Guardar PDF
      const fileName = `Reporte_${branchName.replace(/\s+/g, "_")}_${format(startDate, "yyyyMMdd")}_${format(endDate, "yyyyMMdd")}.pdf`;
      doc.save(fileName);

      setIsOpen(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Generar Reporte PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generar Reporte PDF
          </DialogTitle>
          <DialogDescription>
            Selecciona el rango de fechas para generar el reporte completo de <strong>{branchName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date > new Date() || (endDate ? date > endDate : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date > new Date() || (startDate ? date < startDate : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Período seleccionado:{" "}
                <strong className="text-foreground">
                  {differenceInDays(endDate, startDate) + 1} días
                </strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Del{" "}
                <strong className="text-foreground">
                  {format(startDate, "d 'de' MMMM yyyy", { locale: es })}
                </strong>{" "}
                al{" "}
                <strong className="text-foreground">
                  {format(endDate, "d 'de' MMMM yyyy", { locale: es })}
                </strong>
              </p>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                El reporte incluirá: Resumen ejecutivo, fuentes de tráfico, 
                dispositivos, navegadores, tendencias diarias y análisis de conversiones.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={generatePDF}
            disabled={!startDate || !endDate || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Descargar PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
