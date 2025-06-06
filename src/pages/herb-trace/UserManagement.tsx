import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import HerbTraceLayout from '@/components/layouts/HerbTraceLayout';
import { mockUsers, MockUser, UserStatus } from '@/utils/mockUserData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: UserStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
      farmer: 'เกษตรกร',
      lab: 'ห้องปฏิบัติการ',
      manufacturer: 'ผู้ผลิต',
      ttm_officer: 'เจ้าหน้าที่แพทย์แผนไทย',
      acfs_officer: 'เจ้าหน้าที่ ACFS',
      customs_officer: 'เจ้าหน้าที่ศุลกากร',
      admin: 'ผู้ดูแลระบบ',
      data_consumer: 'ผู้ใช้ข้อมูล',
      guest: 'ผู้เยี่ยมชม'
    };
    return roleNames[role] || role;
  };

  // Count users by role
  const usersByRole = mockUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count users by status
  const usersByStatus = mockUsers.reduce((acc, user) => {
    acc[user.status] = (acc[user.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <HerbTraceLayout activeTab="settings">
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">จัดการผู้ใช้ระบบ</h1>
            <p className="text-gray-600 mt-2">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <UserPlus className="h-4 w-4 mr-2" />
            เพิ่มผู้ใช้ใหม่
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ผู้ใช้ที่ใช้งานอยู่</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{usersByStatus.active || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เกษตรกร</CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{usersByRole.farmer || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รอการอนุมัติ</CardTitle>
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{usersByStatus.pending || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ค้นหาและกรองข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ค้นหาชื่อ, อีเมล, หรือ username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="เลือกบทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">บทบาททั้งหมด</SelectItem>
                  <SelectItem value="farmer">เกษตรกร</SelectItem>
                  <SelectItem value="lab">ห้องปฏิบัติการ</SelectItem>
                  <SelectItem value="manufacturer">ผู้ผลิต</SelectItem>
                  <SelectItem value="ttm_officer">เจ้าหน้าที่แพทย์แผนไทย</SelectItem>
                  <SelectItem value="acfs_officer">เจ้าหน้าที่ ACFS</SelectItem>
                  <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งานอยู่</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                  <SelectItem value="pending">รอการอนุมัติ</SelectItem>
                  <SelectItem value="suspended">ระงับการใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">รายชื่อผู้ใช้ ({filteredUsers.length} คน)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">ผู้ใช้</th>
                    <th className="text-left p-4">บทบาท</th>
                    <th className="text-left p-4">จังหวัด</th>
                    <th className="text-left p-4">สถานะ</th>
                    <th className="text-left p-4">การยืนยัน</th>
                    <th className="text-left p-4">เข้าสู่ระบบล่าสุด</th>
                    <th className="text-left p-4">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0, 50).map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">@{user.username}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{user.province}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === 'active' ? 'ใช้งานอยู่' :
                           user.status === 'inactive' ? 'ไม่ใช้งาน' :
                           user.status === 'pending' ? 'รอการอนุมัติ' : 'ระงับการใช้งาน'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {user.verificationStatus ? (
                          <Badge className="bg-green-100 text-green-800">ยืนยันแล้ว</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">ยังไม่ยืนยัน</Badge>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {user.lastLoginDate ? 
                          new Date(user.lastLoginDate).toLocaleDateString('th-TH') : 
                          'ยังไม่เข้าสู่ระบบ'
                        }
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>ข้อมูลผู้ใช้: {user.fullName}</DialogTitle>
                                <DialogDescription>
                                  รายละเอียดข้อมูลผู้ใช้และสถิติการใช้งาน
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>อีเมล:</strong> {user.email}
                                </div>
                                <div>
                                  <strong>เบอร์โทร:</strong> {user.profile.phoneNumber || 'ไม่ระบุ'}
                                </div>
                                <div>
                                  <strong>องค์กร:</strong> {user.organization || 'ไม่ระบุ'}
                                </div>
                                <div>
                                  <strong>วันที่สมัคร:</strong> {new Date(user.registrationDate).toLocaleDateString('th-TH')}
                                </div>
                                <div className="col-span-2">
                                  <strong>สถิติการใช้งาน:</strong>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>เข้าสู่ระบบ: {user.stats.logins} ครั้ง</div>
                                    <div>ส่งข้อมูล: {user.stats.submissions} ครั้ง</div>
                                    <div>ใบรับรอง: {user.stats.certifications} ใบ</div>
                                    <div>ตรวจสอบย้อนกลับ: {user.stats.traceabilityScans} ครั้ง</div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </HerbTraceLayout>
  );
}
