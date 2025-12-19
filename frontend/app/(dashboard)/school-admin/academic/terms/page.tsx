"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, MoreHorizontal, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function TermsPage() {
    const [terms, setTerms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTerm, setNewTerm] = useState({ name: "", startDate: "", endDate: "" })

    useEffect(() => {
        // Mock fetch
        setTimeout(() => {
            setTerms([
                { id: 1, name: "Term 1", startDate: "2024-01-15", endDate: "2024-04-15", status: "completed" },
                { id: 2, name: "Term 2", startDate: "2024-05-01", endDate: "2024-08-01", status: "active" },
                { id: 3, name: "Term 3", startDate: "2024-09-01", endDate: "2024-12-15", status: "upcoming" },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const handleCreateTerm = async () => {
        // Mock create
        toast.success("Term created successfully")
        setTerms([...terms, {
            id: Date.now(),
            name: newTerm.name,
            startDate: newTerm.startDate,
            endDate: newTerm.endDate,
            status: "upcoming"
        }])
        setIsDialogOpen(false)
        setNewTerm({ name: "", startDate: "", endDate: "" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Terms & Semesters</h1>
                    <p className="text-muted-foreground">Manage academic terms and grading periods.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Term
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Term</DialogTitle>
                            <DialogDescription>
                                Define a new academic term for the current year.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Term 1"
                                    className="col-span-3"
                                    value={newTerm.name}
                                    onChange={(e) => setNewTerm({ ...newTerm, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="startDate" className="text-right">
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    className="col-span-3"
                                    value={newTerm.startDate}
                                    onChange={(e) => setNewTerm({ ...newTerm, startDate: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="endDate" className="text-right">
                                    End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    className="col-span-3"
                                    value={newTerm.endDate}
                                    onChange={(e) => setNewTerm({ ...newTerm, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleCreateTerm}>Create Term</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Term Name</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            terms.map((term) => (
                                <TableRow key={term.id}>
                                    <TableCell className="font-medium">{term.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {formatDate(term.startDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {formatDate(term.endDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            term.status === "active" ? "default" :
                                                term.status === "completed" ? "secondary" : "outline"
                                        }>
                                            {term.status.charAt(0).toUpperCase() + term.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
