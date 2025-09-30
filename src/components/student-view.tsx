"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, BookOpen, Trophy, Edit, Trash2, Plus } from "lucide-react"
import { useAuth } from "./auth-provider"

export interface Student {
  id: string
  rollNo: string
  name: string
  class: string | null
  section: string | null
  createdAt: string
  updatedAt: string
}

interface Mark {
  id: string
  examName: string
  marks: Record<string, number>
  createdAt: string
  updatedAt: string
}

interface StudentViewProps {
  student: Student
  marks?: Mark[]
  loading?: boolean
  onEditStudent?: (student: Student) => void
  onDeleteStudent?: (student: Student) => void
  onAddMarks?: (student: Student) => void
  onEditMarks?: (mark: Mark) => void
  onDeleteMarks?: (mark: Mark) => void
}

export function StudentView({
  student,
  marks = [],
  loading = false,
  onEditStudent,
  onDeleteStudent,
  onAddMarks,
  onEditMarks,
  onDeleteMarks
}: StudentViewProps) {
  const { user } = useAuth()
  const isTeacher = user?.role === 'TEACHER'

  const calculateTotalMarks = (subjectMarks: Record<string, number>) => {
    return Object.values(subjectMarks).reduce((sum, mark) => sum + mark, 0)
  }

  const calculatePercentage = (subjectMarks: Record<string, number>) => {
    const total = calculateTotalMarks(subjectMarks)
    const maxMarks = Object.keys(subjectMarks).length * 100 // Assuming 100 max per subject
    return maxMarks > 0 ? ((total / maxMarks) * 100).toFixed(2) : "0"
  }

  // TODO: Grade functionality commented out for future use
  // const getGrade = (percentage: number) => {
  //   if (percentage >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-800' }
  //   if (percentage >= 80) return { grade: 'A', color: 'bg-green-100 text-green-800' }
  //   if (percentage >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-800' }
  //   if (percentage >= 60) return { grade: 'B', color: 'bg-blue-100 text-blue-800' }
  //   if (percentage >= 50) return { grade: 'C', color: 'bg-yellow-100 text-yellow-800' }
  //   if (percentage >= 40) return { grade: 'D', color: 'bg-orange-100 text-orange-800' }
  //   return { grade: 'F', color: 'bg-red-100 text-red-800' }
  // }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription>Roll No: {student.rollNo}</CardDescription>
              </div>
            </div>
            {isTeacher && (
              <div className="flex gap-2">
                {onEditStudent && (
                  <Button variant="outline" size="sm" onClick={() => onEditStudent(student)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {onDeleteStudent && (
                  <Button variant="destructive" size="sm" onClick={() => onDeleteStudent(student)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Class:</span>
              {student.class ? (
                <Badge variant="outline">{student.class}</Badge>
              ) : (
                <span className="text-gray-400">Not assigned</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Section:</span>
              {student.section ? (
                <Badge variant="outline">{student.section}</Badge>
              ) : (
                <span className="text-gray-400">Not assigned</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Academic Records
              </CardTitle>
              <CardDescription>Examination results and performance</CardDescription>
            </div>
            {isTeacher && onAddMarks && (
              <Button size="sm" onClick={() => onAddMarks(student)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Marks
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {marks.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No examination records found
            </div>
          ) : (
            <div className="space-y-4">
              {marks
                .sort((a, b) => a.examName.localeCompare(b.examName))
                .map((mark, index) => {
                const percentage = parseFloat(calculatePercentage(mark.marks))
                
                // Calculate percentage change from previous exam
                const sortedMarks = marks.sort((a, b) => a.examName.localeCompare(b.examName))
                const previousMark = index > 0 ? sortedMarks[index - 1] : null
                const previousPercentage = previousMark ? parseFloat(calculatePercentage(previousMark.marks)) : null
                const percentageChange = previousPercentage !== null ? percentage - previousPercentage : null
                
                return (
                  <Card key={mark.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">{mark.examName}</CardTitle>
                          <CardDescription>
                            {new Date(mark.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">{percentage}%</span>
                          {percentageChange !== null && (
                            <Badge 
                              variant="outline" 
                              className={percentageChange >= 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                            >
                              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                            </Badge>
                          )}
                          {isTeacher && (
                            <div className="flex gap-1">
                              {onEditMarks && (
                                <Button variant="ghost" size="sm" onClick={() => onEditMarks(mark)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {onDeleteMarks && (
                                <Button variant="ghost" size="sm" onClick={() => onDeleteMarks(mark)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(mark.marks).map(([subject, marks]) => {
                            // const subjectGrade = getGrade(marks) // Commented out for future use
                            return (
                              <TableRow key={subject}>
                                <TableCell className="font-medium capitalize">{subject}</TableCell>
                                <TableCell>{marks}/100</TableCell>
                                <TableCell>
                                  {/* Grade functionality commented out */}
                                  <span className="text-sm text-gray-600">{marks}%</span>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          <TableRow className="bg-gray-50 dark:bg-gray-800">
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="font-bold">
                              {calculateTotalMarks(mark.marks)}/{Object.keys(mark.marks).length * 100}
                            </TableCell>
                            <TableCell>
                              <span className="font-bold">{percentage}%</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
