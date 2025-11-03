import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface HistoryRecord {
  id: string;
  weekStartDate: Date;
  auditEmployee1: string;
  auditEmployee2: string;
  auditDay: number;
  balanceCheckEmployee: string;
  notes?: string;
}

interface HistoryTableProps {
  records: HistoryRecord[];
  itemsPerPage?: number;
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function HistoryTable({
  records,
  itemsPerPage = 10,
}: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = records.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.auditEmployee1.toLowerCase().includes(searchLower) ||
      record.auditEmployee2.toLowerCase().includes(searchLower) ||
      record.balanceCheckEmployee.toLowerCase().includes(searchLower) ||
      dayNames[record.auditDay - 1].toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by employee name or day..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Week Starting</TableHead>
              <TableHead className="font-semibold">Audit Pair</TableHead>
              <TableHead className="font-semibold">Audit Day</TableHead>
              <TableHead className="font-semibold">Balance Check</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              paginatedRecords.map((record, index) => (
                <TableRow key={record.id} data-testid={`row-history-${index}`}>
                  <TableCell className="font-mono text-sm" data-testid={`text-date-${index}`}>
                    {format(record.weekStartDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="capitalize font-medium" data-testid={`text-audit1-${index}`}>
                        {record.auditEmployee1}
                      </span>
                      <span className="text-muted-foreground">&</span>
                      <span className="capitalize font-medium" data-testid={`text-audit2-${index}`}>
                        {record.auditEmployee2}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" data-testid={`badge-day-${index}`}>
                      {dayNames[record.auditDay - 1]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-medium" data-testid={`text-balance-${index}`}>
                      {record.balanceCheckEmployee}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground" data-testid={`text-notes-${index}`}>
                      {record.notes || "-"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRecords.length)} of{" "}
            {filteredRecords.length} records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
