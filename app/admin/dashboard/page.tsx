"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  QrCode,
  Scan,
  Users,
  Download,
  Search,
  LogOut,
  UserCheck,
  Calendar,
  TrendingUp,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  UserPlus,
  Camera,
  FileSpreadsheet,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { type User, authService, attendanceService } from "@/lib/auth"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import { UserInfoModal } from "@/components/user-info-modal";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner"
import { SimpleAvatar } from "@/components/simple-avatar"
import { ErrorHandler } from "@/lib/error-handler"
import { ACM_ROLES } from "@/lib/config"
import * as XLSX from "xlsx"
import { toast } from "sonner"

// Base64 encoded sound data for audio feedback
const SUCCESS_SOUND_DATA =
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // Truncated for brevity
const ERROR_SOUND_DATA =
  `data:audio/wav;base64,UklGRq4HAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdIHAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg-`

const DAILY_SUBJECT_KEY = "dailyAttendanceSubject";

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [scanResult, setScanResult] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dailySubject, setDailySubject] = useState("")
  const [isEditingSubject, setIsEditingSubject] = useState(false)
  const [tempDailySubject, setTempDailySubject] = useState("")
  const [manualStudentId, setManualStudentId] = useState("")
  const [todayAttendance, setTodayAttendance] = useState<any[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [scannedUser, setScannedUser] = useState<User | null>(null)
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isAdminInfoOpen, setIsAdminInfoOpen] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)
  const [rawQrContent, setRawQrContent] = useState<string>("")
  const [scanStatus, setScanStatus] = useState<"neutral" | "success" | "error" | "paused">("paused")
  const [isScannerPaused, setIsScannerPaused] = useState(true)
  const resetScanStateTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isManualMarking, setIsManualMarking] = useState(false)
  const [manualFoundUser, setManualFoundUser] = useState<User | null>(null)
  const [manualAttendanceStatus, setManualAttendanceStatus] = useState<{ marked: boolean; time?: string; subject?: string } | null>(null)
  const [attendanceStats, setAttendanceStats] = useState<{ [key: string]: { percentage: number } }>({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<User[]>([])
  const [manualSearchTerm, setManualSearchTerm] = useState("")

  const router = useRouter()

  const departments = [
    "Computer Science Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
  ]

  const playSound = (soundData: string) => {
    // This function is safe to call even in environments where Audio is not available.
    if (typeof window !== "undefined" && typeof Audio !== "undefined") {
      new Audio(soundData).play().catch((e) => {
        // Autoplay was prevented, which is common. User interaction is needed.
        // We can safely ignore this error in this context.
        console.error("Error playing sound:", e)
      })
    }
  }

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.push("/")
      return
    }

    if (user.role !== "admin") {
      router.push("/user/dashboard")
      return
    }

    setCurrentUser(user)
    loadData()

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [router])

  useEffect(() => {
    // This effect runs once on mount to check for a persisted daily subject.
    const storedSubjectData = localStorage.getItem(DAILY_SUBJECT_KEY);
    if (storedSubjectData) {
      try {
        const { subject, date } = JSON.parse(storedSubjectData);
        const today = new Date().toISOString().split("T")[0];

        if (date === today) {
          setDailySubject(subject);
        } else {
          // If the stored date is not today, clear it.
          localStorage.removeItem(DAILY_SUBJECT_KEY);
        }
      } catch (error) {
        console.error("Failed to parse daily subject from localStorage", error);
        localStorage.removeItem(DAILY_SUBJECT_KEY);
      }
    }
  }, []);

  const loadData = async () => {
    try {
      const allStudents = await authService.getAllUsers()
      setStudents(allStudents)

      const attendance = await attendanceService.getTodayAttendance()
      setTodayAttendance(attendance)

      // Fetch attendance stats for all students at once for efficiency
      const statsData = await attendanceService.getAllAttendanceStats()
      if (Array.isArray(statsData)) {
        const statsMap = statsData.reduce((acc, stat) => {
          acc[stat.userId] = { percentage: stat.percentage }
          return acc
        }, {} as { [key: string]: { percentage: number } })
        setAttendanceStats(statsMap)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleScanResult = async (detectedCodes: IDetectedBarcode[]) => {
    // The scanner can fire multiple times for the same QR code.
    const result = detectedCodes[0]?.rawValue
    if (!result || isScannerPaused) {
      return
    }

    setIsScannerPaused(true) // Pause scanner to prevent re-scans

    if (resetScanStateTimeout.current) {
      clearTimeout(resetScanStateTimeout.current)
    }

    setRawQrContent(result)

    resetScanStateTimeout.current = setTimeout(() => {
      if (!isScannerPaused) setIsScannerPaused(false) // Resume scanner only if it was active
      setRawQrContent("")
      setScanResult("")
      setScanStatus(isScannerPaused ? "paused" : "neutral")
    }, 2500)

    if (!dailySubject) {
      playSound(ERROR_SOUND_DATA)
      alert("Please set an Event/Subject for today first!")
      setScanStatus("error")
      return
    }

    if (!currentUser) return // Guard against missing current user

    // The QR code from the student dashboard contains the registration number or user ID as plain text.
    const studentIdentifier = result.trim()

    if (!studentIdentifier) {
      // This case should not be reached if result is not empty, but it's a good guard.
      return
    }

    const student = students.find(
      (s) => s.registrationNumber === studentIdentifier || s.studentId === studentIdentifier || s.id === studentIdentifier,
    )
    
    if (student) {
      setScannedUser(student)
      const attendanceResult = await attendanceService.markAttendance(student.id, dailySubject, currentUser.id, "present", "scanner")
      if (attendanceResult.success) {
        playSound(SUCCESS_SOUND_DATA)
        setScanStatus("success")
        setScanResult(`✅ Attendance marked successfully.`)
        await loadData() // Refresh today's attendance list
      } else {
        // This handles "already marked" and other errors
        playSound(ERROR_SOUND_DATA)
        setScanStatus("error")
        setScanResult(`❌ ${attendanceResult.error}`)
      }
    } else {
      playSound(ERROR_SOUND_DATA)
      setScannedUser(null)
      setScanStatus("error")
      setScanResult(`❌ Registration number "${studentIdentifier}" not found. This user is not a member.`)
    }
  }

  const handleMarkAttendanceFromModal = async () => {
    if (scannedUser && dailySubject && currentUser) {
      const result = await attendanceService.markAttendance(scannedUser.id, dailySubject, currentUser.id)
      if (result.success) {
        alert(`✅ Attendance for "${dailySubject}" marked successfully for ${scannedUser.fullName}!`)
        await loadData() // Refresh data
        setIsUserInfoModalOpen(false)
        setScannedUser(null)
        setScanResult("")
      } else {
        alert(`❌ ${result.error}`)
      }
    }
  }

  const handleFindStudentForManualAttendance = async () => {
    if (!manualStudentId || !dailySubject) {
      toast.warning("Please enter a student ID and ensure the daily subject is set.")
      return
    }
    setIsManualMarking(true)
    const student = await authService.findUserByIdentifier(manualStudentId);
    if (!student || student.role !== "user") {
      toast.error("Student not found. This person is not a member.")
      setIsManualMarking(false)
      return
    }
    setManualFoundUser(student);
    
    // Check if attendance was already marked for this user and subject today
    const attendanceRecord = todayAttendance.find(rec => rec.user_id === student.id && rec.subject_name === dailySubject);
    if (attendanceRecord) {
      setManualAttendanceStatus({ marked: true, time: attendanceRecord.attendance_time, subject: attendanceRecord.subject_name });
    } else {
      setManualAttendanceStatus({ marked: false });
    }
    
    setIsUserInfoModalOpen(true);
    setIsManualMarking(false);
  }

  const confirmAndMarkManualAttendance = async () => {
    if (!manualFoundUser || !dailySubject || !currentUser) {
      toast.error("An error occurred. Missing user or subject information.");
      return;
    }
    const result = await attendanceService.markAttendance(manualFoundUser.id, dailySubject, currentUser.id, "present", "manual");
    if (result.success) {
      toast.success(`✅ Attendance marked for ${manualFoundUser.fullName}!`);
      await loadData();
    } else {
      toast.error(`❌ ${result.error}`);
    }
    setIsUserInfoModalOpen(false);
    setManualFoundUser(null);
    setManualAttendanceStatus(null);
    setManualStudentId("");
  }

  const handleManualToggle = async (student: User, isPresent: boolean) => {
    if (!dailySubject || !currentUser) {
      toast.error("Please set the daily event before marking attendance.")
      return
    }

    // Optimistic UI update: Change the state immediately for a responsive feel.
    const originalAttendance = [...todayAttendance];

    if (isPresent) {
      // Temporarily add a placeholder record to make the switch move instantly.
      const placeholderRecord = { user_id: student.id, subject_name: dailySubject, attendance_time: 'now', status: 'present' };
      setTodayAttendance(prev => [...prev, placeholderRecord]);

      // Mark as present
      const result = await attendanceService.markAttendance(student.id, dailySubject, currentUser.id, "present", "manual")
      if (result.success) {
        toast.success(`✅ Attendance marked for ${student.fullName}.`)
      } else {
        toast.error(`❌ ${result.error || "Failed to mark attendance."}`)
        setTodayAttendance(originalAttendance); // Revert on failure
      }
    } else {
      // Temporarily remove the record to make the switch move instantly.
      setTodayAttendance(prev => prev.filter(rec => !(rec.user_id === student.id && rec.subject_name === dailySubject)));

      // Find and delete the attendance record
      const record = todayAttendance.find(rec => rec.user_id === student.id && rec.subject_name === dailySubject)
      if (record) {
        const result = await attendanceService.deleteAttendance(record.id)
        if (result.success) {
          toast.info(`ⓘ Attendance for ${student.fullName} has been removed.`)
        } else {
          toast.error(`❌ ${result.error || "Failed to remove attendance."}`)
          setTodayAttendance(originalAttendance); // Revert on failure
        }
      } else {
        // This case can happen if the state is out of sync.
        toast.warning(`No attendance record found for ${student.fullName} to remove.`);
      }
    }
    // Finally, reload data from the server to ensure consistency.
    await loadData()
  }
  const handleLogout = () => {
    authService.logout()
    router.push("/")
  }

  const exportToExcel = () => {
    // Prepare the data for export, using all students to match "export all user data"
    const dataToExport = students.map((student) => {
      const attendancePercentage = getAttendancePercentage(student.id)
      return {
        "Full Name": student.fullName,
        "Registration Number": student.registrationNumber || "N/A",
        "Email": student.email,
        "Department": student.department,
        "Year": student.year,
        "Section": student.section,
        "Student ID": student.studentId,
        "ACM Member": student.acmMember ? "Yes" : "No",
        "ACM Role": student.acmRole || "N/A",
        "Attendance %": attendancePercentage,
        "Status": student.isActive ? "Active" : "Inactive",
        "Join Date": new Date(student.joinDate).toLocaleDateString(),
      }
    })

    // Create a new workbook and a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 25 }, // Full Name
      { wch: 20 }, // Registration Number
      { wch: 30 }, // Email
      { wch: 40 }, // Department
      { wch: 15 }, // Year
      { wch: 10 }, // Section
      { wch: 15 }, // Student ID
      { wch: 12 }, // ACM Member
      { wch: 20 }, // ACM Role
      { wch: 15 }, // Attendance %
      { wch: 10 }, // Status
      { wch: 15 }, // Join Date
    ]

    // Generate the Excel file and trigger the download
    XLSX.writeFile(workbook, `students_report_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportDailyAttendance = async () => {
    try {
      const dailyRecords = await attendanceService.getDailyAttendance(selectedDate)

      if (!dailyRecords || dailyRecords.length === 0) {
        alert(`No attendance records found for ${selectedDate}.`)
        return
      }

      const dataToExport = dailyRecords.map((record: any) => ({
        "Student Name": record.user_name,
        "Registration Number": record.registration_number,
        "Email": record.email,
        "Event/Subject": record.subject_name,
        "Time": record.attendance_time,
        "Status": record.status,
        "Marked By (Admin ID)": record.marked_by,
      }))

      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance ${selectedDate}`)

      worksheet["!cols"] = [
        { wch: 25 }, // Student Name
        { wch: 20 }, // Registration Number
        { wch: 30 }, // Email
        { wch: 30 }, // Event/Subject
        { wch: 15 }, // Time
        { wch: 10 }, // Status
        { wch: 30 }, // Marked By
      ]

      XLSX.writeFile(workbook, `daily_attendance_report_${selectedDate}.xlsx`)
    } catch (error) {
      console.error("Failed to export daily attendance:", error)
      alert("An error occurred while exporting the data. Please check the console for details.")
    }
  }

  const handleExportAcmTeamReport = () => {
    const acmMembers = students.filter((student) => student.acmMember)

    if (acmMembers.length === 0) {
      alert("No ACM members found to export.")
      return
    }

    // Sort by role to group them in the sheet, using the predefined order
    acmMembers.sort((a, b) => {
      const roleA = a.acmRole || "Member"
      const roleB = b.acmRole || "Member"
      const indexA = ACM_ROLES.indexOf(roleA)
      const indexB = ACM_ROLES.indexOf(roleB)

      // Handle roles not in the list by putting them at the end
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })

    const dataToExport = acmMembers.map((student) => {
      const attendancePercentage = getAttendancePercentage(student.id) // Uses placeholder logic from getAttendancePercentage
      return {
        "Full Name": student.fullName,
        "ACM Role": student.acmRole || "N/A",
        "Registration Number": student.registrationNumber || "N/A",
        "Email": student.email,
        "Phone": student.phone || "N/A",
        "Department": student.department,
        "Year": student.year,
        "Section": student.section,
        "Attendance %": attendancePercentage,
        "Join Date": new Date(student.joinDate).toLocaleDateString(),
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "ACM Team Report")

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 40 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 },
    ]

    XLSX.writeFile(workbook, `acm_team_report_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const handleExportUserAttendance = (userId: string) => {
    attendanceService.exportUserAttendance(userId)
  }

  const getAttendancePercentage = (userId: string) => {
    return attendanceStats[userId]?.percentage ?? 0
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment

    return matchesSearch && matchesDepartment
  })

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 85) return "bg-green-100 text-green-700 border-green-200"
    if (percentage >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  const handleDeleteUser = async (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      alert("You cannot delete your own account from the dashboard.")
      return
    }
    if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      const result = await authService.deleteUser(userId)
      if (result.success) {
        alert("User deleted successfully!")
        await loadData()
      } else {
        alert(`Error: ${result.error}`)
      }
    }
  }

  const handleDeleteAttendance = async (attendanceId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this attendance record? This action cannot be undone.")) {
      const result = await attendanceService.deleteAttendance(attendanceId)
      if (result.success) {
        alert("Attendance record deleted successfully!")
        await loadData()
      } else {
        alert(`Error: ${result.error}`)
      }
    }
  }

  const handleSaveSubject = () => {
    const trimmedSubject = tempDailySubject.trim()
    if (!trimmedSubject) {
      alert("Subject/Event name cannot be empty.")
      return
    }
    setDailySubject(trimmedSubject)
    localStorage.setItem(
      DAILY_SUBJECT_KEY,
      JSON.stringify({ subject: trimmedSubject, date: new Date().toISOString().split("T")[0] })
    );
    setIsEditingSubject(false)
  }

  const stats = [
    {
      title: "Total Students",
      value: students.length.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Present Today",
      value: todayAttendance.length.toString(),
      change: "+5.2%",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-emerald-500",
      trend: "up",
    },
    {
      title: "Attendance Rate",
      value: students.length > 0 ? `${Math.round((todayAttendance.length / students.length) * 100)}%` : "0%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    {
      title: "Total Events",
      value: "1", // This is now managed as a single daily subject
      change: "0%",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-red-500",
      trend: "neutral",
    },
  ]

  const getScannerBoxClasses = () => {
    switch (scanStatus) {      
      case "success":
        return "border-solid border-green-500 ring-4 ring-green-500/30"
      case "error":
        return "border-solid border-red-500 ring-4 ring-red-500/30"
      default: // "neutral" or "paused"
        return "border-dashed border-gray-700"
    }
  }

  const manualFilteredStudents = students.filter(student => 
    student.registrationNumber?.toLowerCase().includes(manualSearchTerm.toLowerCase()) ||
    student.fullName?.toLowerCase().includes(manualSearchTerm.toLowerCase())
  );

  const isStudentPresent = (studentId: string) => {
    return todayAttendance.some(rec => rec.user_id === studentId && rec.subject_name === dailySubject)
  }
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-75 animate-pulse-glow"></div>
                <div className="relative bg-white p-3 rounded-xl shadow-lg">
                  <QrCode className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  SmartAttend Admin
                </h1>
                <p className="text-sm text-gray-600 font-medium">Administrative Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Enhanced Time and Date Display */}
              <div className="hidden md:flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 font-mono">{currentTime.toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-600">Live Time</div>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-600">Today</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div onClick={() => setIsAdminInfoOpen(true)} className="cursor-pointer">
                  <SimpleAvatar
                    src={currentUser.profileImage || "/placeholder.svg"}
                    fallback={ErrorHandler.handleSplitError(currentUser.fullName, "A")}
                    className="h-10 w-10 ring-2 ring-purple-200 hover:ring-purple-400 transition-all duration-300"
                    size="md"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-gray-900">{ErrorHandler.handleNullValue(currentUser.fullName, "Admin")}</div>
                  <div className="text-xs text-gray-500">System Administrator</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-white/80 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
  </header>
  <>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-orange-600" />
                <span>Today's Event / Subject</span>
              </div>
              {!isEditingSubject ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempDailySubject(dailySubject)
                    setIsEditingSubject(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingSubject(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveSubject}>
                    Save
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>Set the event or subject for all attendance marking today. This can be edited anytime.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingSubject ? <Input value={tempDailySubject} onChange={(e) => setTempDailySubject(e.target.value)} placeholder="Enter the event or subject for today" className="text-2xl font-bold h-12" /> : <p className="text-2xl font-bold text-gray-800">{dailySubject || "No event/subject set for today."}</p>}
          </CardContent>
        </Card>
        {/* Enhanced Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 card-hover"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">{stat.title}</p>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      <span
                        className={`text-sm font-semibold ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg`}>
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg p-2 rounded-2xl">
            <TabsTrigger
              value="scan"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
            >
              QR Scanner
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
            >
              Student Management
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
            >
              Today's Attendance
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
            >
              Reports & Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Scanner */}
              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Scan className="h-6 w-6 text-orange-600" />
                        <span>QR Code Scanner</span>
                      </CardTitle>
                      <CardDescription>Scan student QR codes to mark attendance.</CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsScannerPaused(!isScannerPaused)}
                      disabled={!dailySubject}
                      className={`w-32 transition-all duration-300 ${
                        isScannerPaused
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      } text-white shadow-lg rounded-xl`}
                    >
                      {isScannerPaused ? "Start Scan" : "Pause Scan"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div
                    className={`relative w-full max-w-md p-2 rounded-2xl border-4 transition-all duration-300 ${getScannerBoxClasses()}`}
                  >
                    <Scanner
                      paused={isScannerPaused || !dailySubject}
                      onScan={handleScanResult}
                      onError={(e) => setScannerError(e.message)}
                      components={{
                        formats: [
                          "qr_code",
                          "code_128",
                          "code_39",
                          "code_93",
                          "codabar",
                          "ean_13",
                          "ean_8",
                          "itf",
                          "upc_a",
                          "upc_e",
                          "data_matrix",
                        ],
                        finder: true,
                        torch: true,
                      }}
                      styles={{
                        container: { borderRadius: "12px", width: "100%" },
                        finder: { borderColor: "rgba(255, 255, 255, 0.5)" },
                      }}
                    />
                    {(isScannerPaused || !dailySubject) && (
                      <div className="absolute inset-0 bg-gray-800/90 flex flex-col items-center justify-center text-white rounded-xl z-10 p-4 text-center">
                        {!dailySubject ? (
                          <>
                            <XCircle className="h-12 w-12 mb-4 text-red-400" />
                            <p className="text-lg font-semibold">Set an Event to Start</p>
                            <p className="text-sm text-gray-300">You must set a daily event/subject before you can start scanning.</p>
                          </>
                        ) : (
                          <>
                            <Camera className="h-12 w-12 mb-4 text-gray-400" />
                            <p className="text-lg font-semibold">Scanner Paused</p>
                            <p className="text-sm text-gray-300">Click "Start Scan" to begin marking attendance.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Right Column: Scan Result & Manual Entry */}
              <div className="space-y-8">
                <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-6 w-6 text-orange-600" />
                      <span>Scan Status</span>
                    </CardTitle>
                    <CardDescription>Result of the last scan will appear here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-6 rounded-2xl text-center transition-all duration-300 ${getScannerBoxClasses()}`}>
                      {scanResult ? (
                        <p className="text-lg font-semibold">{scanResult}</p>
                      ) : (
                        <p className="text-gray-500">Waiting for scan...</p>
                      )}
                      {rawQrContent && <p className="text-sm text-gray-500 mt-2">Scanned: {rawQrContent}</p>}
                      {scannerError && <p className="text-red-500 mt-2">Scanner Error: {scannerError}</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="h-6 w-6 text-orange-600" />
                      <span>Manual Attendance</span>
                    </CardTitle>
                    <CardDescription>Search for a student and toggle their attendance for today's event.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search by name or registration no."
                        value={manualSearchTerm}
                        onChange={(e) => setManualSearchTerm(e.target.value)}
                        className="h-12 pl-10 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                        disabled={!dailySubject}
                      />
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                      {manualFilteredStudents.map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-200/50">
                          <div className="flex items-center space-x-3">
                            <SimpleAvatar 
                              src={student.profileImage}
                              fallback={ErrorHandler.handleSplitError(student.fullName)}
                              size="sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{student.fullName}</p>
                              <p className="text-xs text-gray-500">{student.registrationNumber}</p>
                            </div>
                          </div>
                          <Switch
                            checked={isStudentPresent(student.id)}
                            onCheckedChange={(isChecked) => handleManualToggle(student, isChecked)}
                            disabled={!dailySubject}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                            aria-label={`Toggle attendance for ${student.fullName}`}
                          />
                        </div>
                      ))}
                      {manualFilteredStudents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2" />
                          <p>No students found.</p>
                          <p className="text-xs">Adjust your search or clear the filter.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Student Management Tab */}
          <TabsContent value="students">
            <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-orange-600" />
                      <span>Student Management</span>
                    </CardTitle>
                    <CardDescription>View and manage student records</CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg rounded-xl px-4 py-2"
                      onClick={() => setIsAddStudentModalOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                    <Button
                      onClick={exportToExcel}
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                    
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search students by name, email, or registration number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                      />
                    </div>
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="w-full sm:w-64 h-12 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md rounded-xl">
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredStudents.map((student) => {
                      const attendancePercentage = getAttendancePercentage(student.id)
                      return (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                          <div className="flex items-center space-x-6">
                            <SimpleAvatar
                              src={student.profileImage || "/placeholder.svg"}
                              fallback={ErrorHandler.handleSplitError(student.fullName)}
                              className="h-16 w-16 ring-2 ring-gray-200"
                              size="lg"
                            />

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="text-xl font-bold text-gray-900">{ErrorHandler.handleNullValue(student.fullName, "Unknown Student")}</div>
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    student.isActive ? "bg-green-500" : "bg-gray-400"
                                  } animate-pulse`}
                                ></div>
                                {student.acmMember && student.acmRole && (
                                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                                    ACM {student.acmRole}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-gray-600 mb-1">{ErrorHandler.handleNullValue(student.email)}</div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Reg: {ErrorHandler.handleNullValue(student.registrationNumber)}</span>
                                <span>•</span>
                                <span>{ErrorHandler.handleNullValue(student.department)}</span>
                                {student.studentId && (
                                  <>
                                    <span>•</span>
                                    <span>ID: {student.studentId}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>Joined: {new Date(student.joinDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getAttendanceColor(attendancePercentage)}`}>
                                {attendancePercentage}%
                              </div>
                              <Badge className={`${getAttendanceBadge(attendancePercentage)} text-sm font-semibold`}>
                                {attendancePercentage >= 85
                                  ? "Excellent"
                                  : attendancePercentage >= 75
                                    ? "Good"
                                    : "At Risk"}
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-orange-50"
                                onClick={() => {
                                  setSelectedUser(student)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-teal-50"
                                onClick={() => {
                                  setScannedUser(student)
                                  setIsUserInfoModalOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-50 text-red-600"
                                onClick={() => handleDeleteUser(student.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {filteredStudents.length === 0 && (
                      <div className="text-center py-16">
                        <Users className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                        <p className="text-gray-600 font-semibold text-xl mb-2">No students found</p>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Today's Attendance Tab */}
          <TabsContent value="attendance">
            <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-6 w-6 text-teal-600" />
                      <span>Today's Attendance</span>
                    </CardTitle>
                    <CardDescription>Students who marked attendance today</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-teal-100 text-teal-700 border-teal-200 px-4 py-2 text-lg font-semibold">
                      {todayAttendance.length} students present
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAttendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center space-x-6">
                        <SimpleAvatar
                          src={record.profile_image || `/placeholder.svg?height=56&width=56&text=${ErrorHandler.handleSplitError(record.user_name)}`}
                          fallback={ErrorHandler.handleSplitError(record.user_name)}
                          className="h-14 w-14 ring-2 ring-teal-200"
                          size="lg"
                        />

                        <div>
                          <div className="text-xl font-bold text-gray-900">{ErrorHandler.handleNullValue(record.user_name, "Unknown User")}</div>
                          <div className="text-gray-600 flex items-center space-x-3">
                            <span>Reg: {ErrorHandler.handleNullValue(record.registration_number)}</span>
                            <span>•</span>
                            <span>{ErrorHandler.handleNullValue(record.subject_name)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-700 flex items-center space-x-2">
                          {record.source === 'scanner' ? (
                            <QrCode className="h-5 w-5 text-teal-600" title="Scanned via QR" />
                          ) : (
                            <UserCheck className="h-5 w-5 text-blue-600" title="Marked Manually" />
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-5 w-5" />
                            <span>{record.attendance_time}</span>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            record.status === "present"
                              ? "bg-teal-100 text-teal-800 border-teal-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          } mt-2 font-semibold`}
                        >
                          {record.status === "present" ? (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {todayAttendance.length === 0 && (
                    <div className="text-center py-16">
                      <XCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                      <p className="text-gray-600 font-semibold text-xl mb-2">No attendance records for today</p>
                      <p className="text-gray-500">Students will appear here once they mark attendance</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports & Export Tab */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                    <span>Daily Attendance Export</span>
                  </CardTitle>
                  <CardDescription>Export attendance records for a specific date</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Date</label>
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-12 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl text-lg"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleExportDailyAttendance}
                    className="w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Export Daily Attendance
                  </Button>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <p className="text-sm text-orange-800 font-medium">Export includes:</p>
                    <ul className="text-xs text-orange-700 mt-2 space-y-1">
                      <li>• Student names and registration numbers</li>
                      <li>• Subject and time information</li>
                      <li>• Attendance status and marked by</li>
                      <li>• Complete daily summary</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-teal-600" />
                    <span>Student Reports</span>
                  </CardTitle>
                  <CardDescription>Export individual student attendance details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Individual student reports can be exported from the Student Management tab by clicking the
                      spreadsheet icon next to each student.
                    </p>
                  </div>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                    <p className="text-sm text-teal-800 font-medium">Individual reports include:</p>
                    <ul className="text-xs text-teal-700 mt-2 space-y-1">
                      <li>• Complete student information</li>
                      <li>• ACM membership details</li>
                      <li>• Attendance statistics and percentage</li>
                      <li>• Detailed attendance history</li>
                      <li>• Subject-wise breakdown</li>
                    </ul>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button
                      onClick={exportToExcel}
                      className="w-full h-14 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Export All Students
                    </Button>
                    <Button
                      onClick={handleExportAcmTeamReport}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Export ACM Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Info Modal for Scanned QR */}
      <UserInfoModal
        user={manualFoundUser || scannedUser}
        isOpen={isUserInfoModalOpen}
        onClose={() => {
          setIsUserInfoModalOpen(false)
          setScannedUser(null)
          setManualFoundUser(null)
          setManualAttendanceStatus(null)
        }}
        onMarkAttendance={manualFoundUser ? confirmAndMarkManualAttendance : (scannedUser ? handleMarkAttendanceFromModal : undefined)}
        selectedSubject={dailySubject}
        attendanceStatus={manualFoundUser ? manualAttendanceStatus : null}
      />

      {/* Profile Edit Modal for Selected Student */}
      {selectedUser && (
        <ProfileEditModal
          user={selectedUser}
          isOpen={isEditModalOpen && !!selectedUser}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedUser(null)
          }}
          onUpdate={async (updatedUser) => {
            await loadData() // Refresh the student list
            setIsEditModalOpen(false)
            setSelectedUser(null)
          }}
        />
      )}

      {/* Admin Profile Edit Modal */}
      <ProfileEditModal
        user={currentUser}
        isOpen={isEditModalOpen && !selectedUser}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(updatedUser) => {
          setCurrentUser(updatedUser)
          setIsEditModalOpen(false)
        }}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onStudentAdded={async () => {
          await loadData() // Refresh the student list after adding
          setIsAddStudentModalOpen(false)
        }}
      />

      {/* Admin Info Modal to view own details */}
      <UserInfoModal
        user={currentUser}
        isOpen={isAdminInfoOpen}
        onClose={() => setIsAdminInfoOpen(false)}
        // The attendance props are not relevant for the admin view.
        // We pass safe, neutral values to prevent unintended actions.
        onMarkAttendance={() => {}}
        selectedSubject=""
      />
    </>
  </div>
  )
}
