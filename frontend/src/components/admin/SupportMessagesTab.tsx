import { useState, useEffect } from "react";
import { 
  MessageSquare, Mail, Phone, Clock, CheckCircle, XCircle,
  Send, AlertCircle, Search
} from "lucide-react";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  adminReply?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  repliedAt?: string;
}

export default function SupportMessagesTab() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const token = localStorage.getItem("token");
      const url = statusFilter === "all" 
        ? `${API_BASE}/support`
        : `${API_BASE}/support?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTickets(result.data || []);
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setSending(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/support/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reply: replyMessage,
          notes: adminNotes,
          status: 'in_progress'
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Reply sent successfully!");
        setReplyMessage("");
        setAdminNotes("");
        setSelectedTicket(null);
        loadTickets();
      } else {
        toast.error(result.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_BASE}/support/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Status updated!");
        loadTickets();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    searchQuery === "" ||
    ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'from-yellow-500 to-orange-500';
      case 'in_progress': return 'from-blue-500 to-cyan-500';
      case 'resolved': return 'from-green-500 to-emerald-500';
      case 'closed': return 'from-gray-500 to-slate-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock size={16} />;
      case 'in_progress': return <AlertCircle size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      case 'closed': return <XCircle size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Support Messages</h2>
          <p className="text-gray-600">Manage customer support tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold">
            {filteredTickets.length} Tickets
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
            <MessageSquare size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">Try changing the filter or search query</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Ticket Header */}
              <div className={`bg-gradient-to-r ${getStatusColor(ticket.status)} p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-lg">{ticket.ticketNumber}</span>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm font-bold">{ticket.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <p className="text-sm opacity-90">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>

              {/* Ticket Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{ticket.email}</span>
                  </div>
                  {ticket.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>{ticket.phone}</span>
                    </div>
                  )}
                </div>

                {ticket.adminReply && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
                    <p className="text-sm font-bold text-green-900 mb-1">Admin Reply:</p>
                    <p className="text-sm text-green-700">{ticket.adminReply}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Send size={16} />
                    Reply
                  </button>
                  {ticket.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(ticket.id, 'resolved')}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900">Reply to Ticket</h3>
              <p className="text-gray-600">{selectedTicket.ticketNumber}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Original Message */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-gray-900 mb-2">{selectedTicket.subject}</p>
                <p className="text-gray-700 mb-3">{selectedTicket.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>From: {selectedTicket.name}</span>
                  <span>{selectedTicket.email}</span>
                </div>
              </div>

              {/* Reply Input */}
              <div>
                <label className="block font-bold text-gray-900 mb-2">Your Reply</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-bold text-gray-900 mb-2">Internal Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes (not visible to customer)..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReply}
                  disabled={sending || !replyMessage.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Reply
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setReplyMessage("");
                    setAdminNotes("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
