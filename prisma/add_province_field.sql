-- 为 Visit 表添加 province 字段
-- 在 Supabase Dashboard -> SQL Editor 中执行此脚本

ALTER TABLE "Visit" 
ADD COLUMN "province" TEXT;

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS "Visit_province_idx" ON "Visit"("province");

-- 验证字段已添加
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Visit' 
  AND column_name = 'province';
